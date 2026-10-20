import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Student,
  DailyTopicCardData,
  MissedClassSubject,
  SupportPlan,
  PeerClassmate,
  GroupStudySession,
  ChatMessage,
  LearningGapOverviewItem,
  ParentCommunicationRecord,
  ParentMeetingSchedule,
  AttendanceRecord,
  InterventionRecord,
  MLPredictionResult,
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_DAILY_TOPICS,
  ROHAN_MISSED_SUBJECTS,
  INITIAL_SUPPORT_PLAN,
  INITIAL_PEER_CLASSMATES,
  INITIAL_STUDY_SESSIONS,
  INITIAL_CHAT_MESSAGES,
  INITIAL_LEARNING_GAPS,
  INITIAL_PARENT_RECORDS,
  INITIAL_PARENT_MEETINGS,
  INITIAL_ATTENDANCE,
  INITIAL_INTERVENTIONS,
} from '../data/mockData';
import { predictionService } from './predictionService';

export interface ToastItem {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

interface AppContextType {
  // State
  students: Student[];
  interventions: InterventionRecord[];
  dailyTopics: DailyTopicCardData[];
  missedSubjects: MissedClassSubject[];
  supportPlan: SupportPlan;
  peerClassmates: PeerClassmate[];
  studySessions: GroupStudySession[];
  chatMessages: Record<string, ChatMessage[]>;
  learningGaps: LearningGapOverviewItem[];
  parentRecords: ParentCommunicationRecord[];
  parentMeetings: ParentMeetingSchedule[];
  attendance: AttendanceRecord[];
  activeDate: string;
  selectedClassFilter: string;
  toasts: ToastItem[];
  mlServiceOnline: boolean;

  // Mutations
  setSelectedClassFilter: (className: string) => void;
  setActiveDate: (date: string) => void;
  toggleTaskCompletion: (subjectId: string, taskId: string) => void;
  toggleSupportPlanTask: (taskId: string) => void;
  markSupportPlanCompleted: () => void;
  sendChatMessage: (studentId: string, text: string) => void;
  connectPeer: (peerId: string) => void;
  joinStudySession: (sessionId: string) => void;
  sendParentMessage: (draft: {
    studentId: string;
    studentName: string;
    messageType: ParentCommunicationRecord['messageType'];
    channel: ParentCommunicationRecord['channel'];
    messageText: string;
  }) => void;
  scheduleMeeting: (studentId: string, studentName: string, slot: string) => void;
  updateAttendance: (id: string, status: 'Present' | 'Absent' | 'Late') => void;
  recordIntervention: (record: Omit<InterventionRecord, 'id'>) => void;
  updateInterventionStatus: (id: string, status: InterventionRecord['status'], outcome?: string) => void;
  checkMLBackend: () => Promise<void>;
  showToast: (title: string, message: string, type?: ToastItem['type']) => void;
  removeToast: (id: string) => void;
  resetDemoData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  MISSED_SUBJECTS: 'eduguard_missed_subjects_v1',
  SUPPORT_PLAN: 'eduguard_support_plan_v1',
  PEERS: 'eduguard_peers_v1',
  STUDY_SESSIONS: 'eduguard_study_sessions_v1',
  CHAT_MESSAGES: 'eduguard_chat_messages_v1',
  PARENT_RECORDS: 'eduguard_parent_records_v1',
  PARENT_MEETINGS: 'eduguard_parent_meetings_v1',
  ATTENDANCE: 'eduguard_attendance_v1',
  INTERVENTIONS: 'eduguard_interventions_v1',
  STUDENTS: 'eduguard_students_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [students, setStudents] = useState<Student[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
  });

  const [interventions, setInterventions] = useState<InterventionRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.INTERVENTIONS);
    return saved ? JSON.parse(saved) : INITIAL_INTERVENTIONS;
  });

  const [dailyTopics] = useState<DailyTopicCardData[]>(INITIAL_DAILY_TOPICS);
  const [learningGaps] = useState<LearningGapOverviewItem[]>(INITIAL_LEARNING_GAPS);

  const [missedSubjects, setMissedSubjects] = useState<MissedClassSubject[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.MISSED_SUBJECTS);
    return saved ? JSON.parse(saved) : ROHAN_MISSED_SUBJECTS;
  });

  const [supportPlan, setSupportPlan] = useState<SupportPlan>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.SUPPORT_PLAN);
    return saved ? JSON.parse(saved) : INITIAL_SUPPORT_PLAN;
  });

  const [peerClassmates, setPeerClassmates] = useState<PeerClassmate[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PEERS);
    return saved ? JSON.parse(saved) : INITIAL_PEER_CLASSMATES;
  });

  const [studySessions, setStudySessions] = useState<GroupStudySession[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDY_SESSIONS);
    return saved ? JSON.parse(saved) : INITIAL_STUDY_SESSIONS;
  });

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CHAT_MESSAGES);
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [parentRecords, setParentRecords] = useState<ParentCommunicationRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PARENT_RECORDS);
    return saved ? JSON.parse(saved) : INITIAL_PARENT_RECORDS;
  });

  const [parentMeetings, setParentMeetings] = useState<ParentMeetingSchedule[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PARENT_MEETINGS);
    return saved ? JSON.parse(saved) : INITIAL_PARENT_MEETINGS;
  });

  const [attendance, setAttendance] = useState<AttendanceRecord[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.ATTENDANCE);
    return saved ? JSON.parse(saved) : INITIAL_ATTENDANCE;
  });

  const [selectedClassFilter, setSelectedClassFilter] = useState<string>('All Classes');
  const [activeDate, setActiveDate] = useState<string>('Mon, 20 Oct 2025');
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [mlServiceOnline, setMlServiceOnline] = useState<boolean>(false);

  // Check ML Service health periodically
  const checkMLBackend = async () => {
    const isOnline = await predictionService.checkHealth();
    setMlServiceOnline(isOnline);
  };

  useEffect(() => {
    checkMLBackend();
    const interval = setInterval(checkMLBackend, 8000);
    return () => clearInterval(interval);
  }, []);

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
  }, [students]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.INTERVENTIONS, JSON.stringify(interventions));
  }, [interventions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.MISSED_SUBJECTS, JSON.stringify(missedSubjects));
  }, [missedSubjects]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.SUPPORT_PLAN, JSON.stringify(supportPlan));
  }, [supportPlan]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PEERS, JSON.stringify(peerClassmates));
  }, [peerClassmates]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.STUDY_SESSIONS, JSON.stringify(studySessions));
  }, [studySessions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CHAT_MESSAGES, JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARENT_RECORDS, JSON.stringify(parentRecords));
  }, [parentRecords]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PARENT_MEETINGS, JSON.stringify(parentMeetings));
  }, [parentMeetings]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE, JSON.stringify(attendance));
  }, [attendance]);

  const showToast = (title: string, message: string, type: ToastItem['type'] = 'success') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, message, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  const recordIntervention = (record: Omit<InterventionRecord, 'id'>) => {
    const newRecord: InterventionRecord = {
      ...record,
      id: `int-${Date.now()}`,
    };
    setInterventions((prev) => [newRecord, ...prev]);

    // Positively adjust student risk score upon intervention
    setStudents((prev) =>
      prev.map((s) => {
        if (s.id === record.studentId) {
          const newScore = Math.max(10, s.riskScore - 6);
          const newRiskLevel = newScore >= 55 ? 'High' : newScore >= 25 ? 'Medium' : 'Low';
          return {
            ...s,
            riskScore: newScore,
            riskLevel: newRiskLevel,
            improving: true,
          };
        }
        return s;
      })
    );

    showToast('Intervention Logged', `Action recorded for ${record.studentName}. Follow-up scheduled for ${record.followUpDate}.`, 'success');
  };

  const updateInterventionStatus = (id: string, status: InterventionRecord['status'], outcome?: string) => {
    setInterventions((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status, outcome: outcome || inv.outcome } : inv))
    );
    showToast('Intervention Updated', `Status changed to ${status}.`);
  };

  const toggleTaskCompletion = (subjectId: string, taskId: string) => {
    setMissedSubjects((prev) =>
      prev.map((sub) => {
        if (sub.id !== subjectId) return sub;
        return {
          ...sub,
          tasks: sub.tasks.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t)),
        };
      })
    );
    showToast('Task Updated', 'Learning task completion status saved.');
  };

  const toggleSupportPlanTask = (taskId: string) => {
    setSupportPlan((prev) => {
      const updatedTasks = prev.tasks.map((t) =>
        t.id === taskId ? { ...t, completed: !t.completed } : t
      );
      const allDone = updatedTasks.every((t) => t.completed);
      return {
        ...prev,
        tasks: updatedTasks,
        completed: allDone,
        lastUpdated: 'Just now',
      };
    });
    showToast('Support Step Updated', 'Progress saved to academic record.');
  };

  const markSupportPlanCompleted = () => {
    setSupportPlan((prev) => ({
      ...prev,
      completed: true,
      tasks: prev.tasks.map((t) => ({ ...t, completed: true })),
      lastUpdated: 'Today (Completed)',
    }));
    showToast('Goal Achieved! 🎓', 'Targeted support plan marked as 100% completed.', 'success');
  };

  const sendChatMessage = (studentId: string, text: string) => {
    if (!text.trim()) return;
    const now = new Date();
    const timeString = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newTeacherMsg: ChatMessage = {
      id: `m-${Date.now()}`,
      studentId,
      sender: 'teacher',
      text,
      timestamp: timeString,
    };

    setChatMessages((prev) => ({
      ...prev,
      [studentId]: [...(prev[studentId] || []), newTeacherMsg],
    }));

    // Realistic auto-reply from classmate after 1.2 seconds
    setTimeout(() => {
      const replyText =
        studentId === 'aarav-sharma'
          ? "Sounds good! I'll see you at the designated study desk. Thanks for helping!"
          : "Thank you! I will bring the exercise questions we discussed.";

      const autoReply: ChatMessage = {
        id: `m-reply-${Date.now()}`,
        studentId,
        sender: 'student',
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => ({
        ...prev,
        [studentId]: [...(prev[studentId] || []), autoReply],
      }));
    }, 1200);
  };

  const connectPeer = (peerId: string) => {
    setPeerClassmates((prev) =>
      prev.map((peer) => {
        if (peer.id === peerId) {
          const nextState = !peer.connected;
          return { ...peer, connected: nextState, pendingRequest: false };
        }
        return peer;
      })
    );
    showToast('Connection Updated', 'Study request sent to classmate.', 'info');
  };

  const joinStudySession = (sessionId: string) => {
    setStudySessions((prev) =>
      prev.map((session) => {
        if (session.id === sessionId) {
          const nextJoined = !session.joined;
          const delta = nextJoined ? 1 : -1;
          return {
            ...session,
            joined: nextJoined,
            memberCount: Math.max(1, session.memberCount + delta),
          };
        }
        return session;
      })
    );
    showToast('Study Session', 'Updated registration for group study.', 'success');
  };

  const sendParentMessage = (draft: {
    studentId: string;
    studentName: string;
    messageType: ParentCommunicationRecord['messageType'];
    channel: ParentCommunicationRecord['channel'];
    messageText: string;
  }) => {
    const newRecord: ParentCommunicationRecord = {
      id: `pc-${Date.now()}`,
      studentId: draft.studentId,
      studentName: draft.studentName,
      messageType: draft.messageType,
      channel: draft.channel,
      date: 'Today',
      status: 'Sent',
      messageText: draft.messageText,
    };

    setParentRecords((prev) => [newRecord, ...prev]);
    showToast(
      'Message Dispatched',
      `Sent ${draft.messageType} via ${draft.channel} to ${draft.studentName}'s parent.`,
      'success'
    );
  };

  const scheduleMeeting = (studentId: string, studentName: string, slot: string) => {
    const newMeeting: ParentMeetingSchedule = {
      id: `pm-${Date.now()}`,
      studentId,
      studentName,
      slot,
      status: 'Confirmed',
      dateScheduled: 'Oct 24, 2025',
    };

    setParentMeetings((prev) => [newMeeting, ...prev]);
    showToast('Meeting Scheduled', `Confirmed consultation with ${studentName}'s parents for ${slot}.`);
  };

  const updateAttendance = (id: string, status: 'Present' | 'Absent' | 'Late') => {
    setAttendance((prev) =>
      prev.map((rec) => (rec.id === id ? { ...rec, status } : rec))
    );
    showToast('Attendance Recorded', `Status changed to ${status}.`);
  };

  const resetDemoData = () => {
    localStorage.clear();
    setStudents(INITIAL_STUDENTS);
    setInterventions(INITIAL_INTERVENTIONS);
    setMissedSubjects(ROHAN_MISSED_SUBJECTS);
    setSupportPlan(INITIAL_SUPPORT_PLAN);
    setPeerClassmates(INITIAL_PEER_CLASSMATES);
    setStudySessions(INITIAL_STUDY_SESSIONS);
    setChatMessages(INITIAL_CHAT_MESSAGES);
    setParentRecords(INITIAL_PARENT_RECORDS);
    setParentMeetings(INITIAL_PARENT_MEETINGS);
    setAttendance(INITIAL_ATTENDANCE);
    showToast('Demo Reset', 'All application state restored to default seed.', 'info');
  };

  return (
    <AppContext.Provider
      value={{
        students,
        interventions,
        dailyTopics,
        missedSubjects,
        supportPlan,
        peerClassmates,
        studySessions,
        chatMessages,
        learningGaps,
        parentRecords,
        parentMeetings,
        attendance,
        activeDate,
        selectedClassFilter,
        toasts,
        mlServiceOnline,
        setSelectedClassFilter,
        setActiveDate,
        toggleTaskCompletion,
        toggleSupportPlanTask,
        markSupportPlanCompleted,
        sendChatMessage,
        connectPeer,
        joinStudySession,
        sendParentMessage,
        scheduleMeeting,
        updateAttendance,
        recordIntervention,
        updateInterventionStatus,
        checkMLBackend,
        showToast,
        removeToast,
        resetDemoData,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
