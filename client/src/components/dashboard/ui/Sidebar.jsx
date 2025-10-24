import React from 'react';
import { Home, BookOpen, GraduationCap, ClipboardCheck, TrendingUp, Users, Settings } from 'lucide-react';

const navItems = [
  { name: 'Dashboard', icon: Home },
  { name: 'Study Library', icon: BookOpen },
  { name: 'Courses/Subjects', icon: GraduationCap },
  { name: 'Flashcards & Quizzes', icon: ClipboardCheck },
  { name: 'Progress Tracker', icon: TrendingUp },
  { name: 'Study Community', icon: Users },
];

const Sidebar = ({ active, setActive }) => (
  <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-100 shadow-xl flex flex-col">
    <div className="h-20 flex items-center justify-center p-4 border-b border-gray-100">
      <h1 className="text-3xl font-extrabold text-teal-700 tracking-tight">
        Zanly <span className="text-amber-500">★</span>
      </h1>
    </div>
    <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.name;
        return (
          <button
            key={item.name}
            onClick={() => setActive(item.name)}
            className={`flex items-center w-full p-3 rounded-xl transition ${
              isActive
                ? 'bg-emerald-100 text-teal-700 font-bold shadow-md'
                : 'text-gray-600 hover:bg-emerald-50 hover:text-teal-600'
            }`}
          >
            <Icon className="w-6 h-6 mr-3" />
            {item.name}
          </button>
        );
      })}
    </nav>
    <div className="p-4 border-t border-gray-100">
      <button className="flex items-center w-full p-3 rounded-xl text-gray-600 hover:bg-gray-100">
        <Settings className="w-6 h-6 mr-3" /> Settings
      </button>
    </div>
  </aside>
);

export default Sidebar;
