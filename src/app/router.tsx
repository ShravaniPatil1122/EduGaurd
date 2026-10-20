import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { HomePage } from '../pages/HomePage';
import { DailyLearningPage } from '../pages/DailyLearningPage';
import { StudentCatchUpPage } from '../pages/StudentCatchUpPage';
import { PeerLearningPage } from '../pages/PeerLearningPage';
import { PeerChatPage } from '../pages/PeerChatPage';
import { LearningGapsPage } from '../pages/LearningGapsPage';
import { LearningGapDetailsPage } from '../pages/LearningGapDetailsPage';
import { SupportPlanPage } from '../pages/SupportPlanPage';
import { ParentConnectPage } from '../pages/ParentConnectPage';
import { CommunicationHistoryPage } from '../pages/CommunicationHistoryPage';
import { StudentsPage } from '../pages/StudentsPage';
import { PredictionsPage } from '../pages/PredictionsPage';
import { AttendancePage } from '../pages/AttendancePage';
import { ReportsPage } from '../pages/ReportsPage';
import { SettingsPage } from '../pages/SettingsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <DashboardLayout />,
    children: [
      {
        index: true,
        element: <DailyLearningPage />, // Matches reference visual entry point
      },
      {
        path: 'home',
        element: <HomePage />,
      },
      {
        path: 'daily-learning',
        element: <DailyLearningPage />,
      },
      {
        path: 'daily-learning/student/:studentId',
        element: <StudentCatchUpPage />,
      },
      {
        path: 'peer-learning',
        element: <PeerLearningPage />,
      },
      {
        path: 'peer-learning/chat/:studentId',
        element: <PeerChatPage />,
      },
      {
        path: 'learning-gaps',
        element: <LearningGapsPage />,
      },
      {
        path: 'learning-gaps/student/:studentId',
        element: <LearningGapDetailsPage />,
      },
      {
        path: 'learning-gaps/student/:studentId/support',
        element: <SupportPlanPage />,
      },
      {
        path: 'parent-connect',
        element: <ParentConnectPage />,
      },
      {
        path: 'parent-connect/history',
        element: <CommunicationHistoryPage />,
      },
      {
        path: 'students',
        element: <StudentsPage />,
      },
      {
        path: 'predictions',
        element: <PredictionsPage />,
      },
      {
        path: 'attendance',
        element: <AttendancePage />,
      },
      {
        path: 'reports',
        element: <ReportsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: '*',
        element: <Navigate to="/daily-learning" replace />,
      },
    ],
  },
]);
