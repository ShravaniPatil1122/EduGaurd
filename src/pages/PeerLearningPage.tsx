import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  MapPin,
  Clock,
  Shield,
  MessageSquare,
  Users2,
  Calendar,
  CheckCircle,
  Video,
  UserCheck,
  Maximize2
} from 'lucide-react';
import { useAppStore } from '../services/store';
import { PeerClassmate } from '../types';
import { LeafletMap } from '../components/peer-learning/LeafletMap';

export const PeerLearningPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    peerClassmates,
    studySessions,
    connectPeer,
    joinStudySession,
    showToast,
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState<'Nearby' | 'Same Class' | 'Same Subject'>('Nearby');
  const [selectedPeer, setSelectedPeer] = useState<PeerClassmate>(peerClassmates[0]);

  // Filtering peers
  const filteredPeers = peerClassmates.filter((peer) => {
    const matchesSearch =
      peer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      peer.subjects.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase())) ||
      peer.class.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (filterTab === 'Same Class') {
      return peer.class === 'Class 10';
    }
    if (filterTab === 'Same Subject') {
      return peer.subjects.includes('Mathematics');
    }
    return true; // 'Nearby'
  });

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-brand-textPrimary tracking-tight">
          Nearby Classmate & Peer Learning Connect
        </h1>
        <p className="text-xs sm:text-sm text-brand-textSecondary mt-0.5">
          Find nearby classmates for subject support, group sessions or one-on-one help.
        </p>
      </div>

      {/* Grid: 4 Columns on widescreen, responsive on tablet/mobile */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* ============================================================== */}
        {/* COLUMN 1: Classmate Search & List (lg:col-span-3) */}
        {/* ============================================================== */}
        <div className="lg:col-span-3 space-y-3.5">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-brand-textMuted absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search student by Mathematics, Science..."
              className="w-full pl-9 pr-3 py-2 bg-white border border-brand-border rounded-xl text-xs text-brand-textPrimary placeholder:text-brand-textMuted focus:outline-none focus:border-brand-emerald shadow-subtle"
            />
          </div>

          {/* Filter Tabs */}
          <div className="flex bg-white p-1 rounded-xl border border-brand-border text-xs">
            {(['Nearby', 'Same Class', 'Same Subject'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFilterTab(tab)}
                className={`flex-1 py-1.5 rounded-lg font-semibold transition-all ${
                  filterTab === tab
                    ? 'bg-brand-emerald text-white shadow-xs'
                    : 'text-brand-textSecondary hover:text-brand-textPrimary'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Student Cards List */}
          <div className="space-y-2.5 max-h-[580px] overflow-y-auto pr-0.5">
            {filteredPeers.map((peer) => {
              const isSelected = selectedPeer.id === peer.id;
              return (
                <div
                  key={peer.id}
                  onClick={() => setSelectedPeer(peer)}
                  className={`bg-white border rounded-2xl p-3 shadow-subtle cursor-pointer transition-all ${
                    isSelected
                      ? 'border-brand-emerald ring-1 ring-brand-emerald/50 bg-emerald-50/20'
                      : 'border-brand-border hover:border-brand-emerald/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={peer.avatar}
                        alt={peer.name}
                        className="w-9 h-9 rounded-full object-cover border border-brand-border shrink-0"
                      />
                      <div>
                        <h3 className="font-bold text-xs text-brand-textPrimary">{peer.name}</h3>
                        <div className="text-[10px] text-brand-textSecondary">
                          {peer.class} • {peer.distance}
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        connectPeer(peer.id);
                      }}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        peer.connected
                          ? 'bg-emerald-100 text-brand-emerald border border-brand-emerald/40'
                          : 'border border-brand-border text-brand-dark bg-white hover:border-brand-emerald'
                      }`}
                    >
                      {peer.connected ? 'Connected' : 'Connect'}
                    </button>
                  </div>

                  <div className="mt-2 flex flex-wrap gap-1">
                    {peer.subjects.map((sub, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 rounded text-[10px] font-medium bg-brand-cyanBg text-brand-dark"
                      >
                        {sub}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ============================================================== */}
        {/* COLUMN 2: Student Profile Preview (lg:col-span-3) */}
        {/* ============================================================== */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle space-y-4">
            {/* Header with Avatar & Details */}
            <div className="flex items-center gap-3">
              <img
                src={selectedPeer.avatar}
                alt={selectedPeer.name}
                className="w-12 h-12 rounded-full object-cover border-2 border-brand-border shadow-xs"
              />
              <div>
                <h3 className="font-bold text-brand-textPrimary text-sm">{selectedPeer.name}</h3>
                <div className="text-[11px] text-brand-textSecondary">
                  {selectedPeer.class} • {selectedPeer.distance}
                </div>
                <div className="text-[11px] font-medium text-brand-emerald mt-0.5">
                  {selectedPeer.subjects.join(' • ')}
                </div>
              </div>
            </div>

            {/* Bio */}
            <p className="text-xs text-brand-textSecondary leading-relaxed bg-brand-cyanBg/40 p-2.5 rounded-xl border border-brand-border">
              "{selectedPeer.bio}"
            </p>

            {/* Primary Action Button */}
            <div className="flex gap-2">
              <button
                onClick={() => connectPeer(selectedPeer.id)}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-semibold transition-all ${
                  selectedPeer.connected
                    ? 'bg-emerald-100 text-brand-emerald border border-brand-emerald'
                    : 'bg-brand-emerald hover:bg-brand-emeraldHover text-white'
                }`}
              >
                {selectedPeer.connected ? '✓ Connected Partner' : 'Connect with Classmate'}
              </button>

              <button
                onClick={() => navigate(`/peer-learning/chat/${selectedPeer.id}`)}
                className="p-2 border border-brand-border hover:border-brand-emerald text-brand-dark rounded-xl bg-white transition-colors"
                title="Open Chat"
              >
                <MessageSquare className="w-4 h-4" />
              </button>
            </div>

            {/* Preferred Study Mode */}
            <div className="space-y-1.5 text-xs">
              <div className="font-bold text-brand-dark">Preferred Study Mode:</div>
              <div className="space-y-1 text-brand-textSecondary text-[11px]">
                {selectedPeer.preferredStudyModes.map((mode, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <CheckCircle className="w-3.5 h-3.5 text-brand-emerald" />
                    <span>{mode}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Availability */}
            <div className="space-y-1.5 text-xs">
              <div className="font-bold text-brand-dark">Availability:</div>
              <div className="flex flex-wrap gap-1">
                {selectedPeer.availabilityDays.map((day, i) => (
                  <span
                    key={i}
                    className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-brand-emerald border border-brand-emerald/30"
                  >
                    {day}
                  </span>
                ))}
              </div>
              <div className="text-[11px] text-brand-textSecondary pt-0.5">
                {selectedPeer.availabilityTime}
              </div>
            </div>

            {/* Location */}
            <div className="pt-2 border-t border-brand-borderLight text-xs flex items-center justify-between text-brand-textSecondary">
              <span className="font-medium">Location:</span>
              <span className="font-semibold text-brand-dark">Within 2 km</span>
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* COLUMN 3: Map Panel (lg:col-span-3) */}
        {/* ============================================================== */}
        <div className="lg:col-span-3 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-bold text-brand-textPrimary uppercase tracking-wider">
              Nearby Study Partners (Map View)
            </h2>
            <button
              onClick={() => showToast('Full Map View', 'Expanded geographic radius to 5km.')}
              className="text-[11px] text-brand-emerald font-semibold hover:underline flex items-center gap-1"
            >
              <Maximize2 className="w-3 h-3" />
              <span>Expand</span>
            </button>
          </div>

          <div className="h-[380px]">
            <LeafletMap
              classmates={filteredPeers}
              selectedClassmate={selectedPeer}
              onSelectClassmate={(peer) => setSelectedPeer(peer)}
            />
          </div>

          <button
            onClick={() => showToast('School Hub', 'Showing central school library meeting location.')}
            className="w-full text-center text-xs font-semibold text-brand-emerald hover:underline"
          >
            View School Study Center Location →
          </button>
        </div>

        {/* ============================================================== */}
        {/* COLUMN 4: Group Study Sessions & Safety (lg:col-span-3) */}
        {/* ============================================================== */}
        <div className="lg:col-span-3 space-y-4">
          {/* Group Study Sessions */}
          <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle space-y-3.5">
            <h2 className="text-xs font-bold text-brand-textPrimary uppercase tracking-wider">
              Group Study Sessions
            </h2>

            <div className="space-y-3">
              {studySessions.map((session) => (
                <div
                  key={session.id}
                  className="p-3 rounded-xl border border-brand-borderLight hover:border-brand-emerald/50 bg-brand-cyanBg/20 space-y-2 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-xs text-brand-textPrimary">{session.title}</h4>
                      <div className="text-[10px] text-brand-textSecondary mt-0.5">
                        {session.time} • {session.days}
                      </div>
                      <div className="text-[10px] text-brand-emerald font-medium mt-0.5">
                        Topic: {session.topic}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="text-[10px] text-brand-textSecondary">
                      {session.memberCount} classmates joined
                    </span>
                    <button
                      onClick={() => joinStudySession(session.id)}
                      className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                        session.joined
                          ? 'bg-emerald-100 text-brand-emerald border border-brand-emerald/40'
                          : 'bg-brand-emerald hover:bg-brand-emeraldHover text-white shadow-xs'
                      }`}
                    >
                      {session.joined ? 'Joined' : 'Join'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Privacy Card */}
          <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-subtle space-y-2.5">
            <div className="flex items-center gap-2 text-brand-emerald font-bold text-xs uppercase tracking-wider">
              <Shield className="w-4 h-4" />
              <span>Safety & Privacy</span>
            </div>

            <ul className="space-y-2 text-[11px] text-brand-textSecondary">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald mt-1 shrink-0" />
                <span>Only verified learners can connect.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald mt-1 shrink-0" />
                <span>Location is shared only with consent.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald mt-1 shrink-0" />
                <span>Use in-built chat and voice/video.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-emerald mt-1 shrink-0" />
                <span>No harassment or inappropriate content.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
