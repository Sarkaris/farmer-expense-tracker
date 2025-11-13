'use client';

import { Trophy, TrendingUp, Award, Sparkles } from 'lucide-react';
import { calculateAchievements } from '@/lib/gamification';

const colorClasses = {
  emerald: 'bg-emerald-500/15 text-emerald-600 border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-400',
  blue: 'bg-blue-500/15 text-blue-600 border-blue-500/30 dark:bg-blue-500/20 dark:text-blue-400',
  amber: 'bg-amber-500/15 text-amber-600 border-amber-500/30 dark:bg-amber-500/20 dark:text-amber-400',
  purple: 'bg-purple-500/15 text-purple-600 border-purple-500/30 dark:bg-purple-500/20 dark:text-purple-400',
  indigo: 'bg-indigo-500/15 text-indigo-600 border-indigo-500/30 dark:bg-indigo-500/20 dark:text-indigo-400',
};

const progressColors = {
  emerald: 'bg-emerald-500',
  blue: 'bg-blue-500',
  amber: 'bg-amber-500',
  purple: 'bg-purple-500',
  indigo: 'bg-indigo-500',
};

export default function FarmerPerformance({ totals, cropSummaries, expenses, crops, yields }) {
  const { achievements, progress } = calculateAchievements({
    totals,
    cropSummaries,
    expenses,
    crops,
    yields,
  });

  if (achievements.length === 0 && progress.length === 0) {
    return (
      <div className="card-surface p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 p-2 sm:p-3">
            <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-heading">Farmer Performance</h3>
            <p className="text-xs sm:text-sm text-muted">Start tracking to unlock achievements!</p>
          </div>
        </div>
        <div className="pt-4 border-t surface-border">
          <p className="text-xs sm:text-sm text-muted text-center py-3 sm:py-4 leading-relaxed">
            Add crops, track expenses, and record yields to earn badges and see your progress.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-surface p-4 sm:p-5 lg:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="rounded-full bg-gradient-to-br from-emerald-500/20 to-blue-500/20 p-2 sm:p-3 shrink-0">
          <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="min-w-0">
          <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-heading">Farmer Performance</h3>
          <p className="text-xs sm:text-sm text-muted">Your achievements and progress</p>
        </div>
      </div>

      {/* Achievements/Badges */}
      {achievements.length > 0 && (
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2">
            <Award className="h-4 w-4 text-amber-500 shrink-0" />
            <h4 className="text-xs sm:text-sm font-semibold text-heading">Badges Earned</h4>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {achievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`flex items-center gap-2 sm:gap-3 p-2.5 sm:p-3 rounded-xl border ${colorClasses[achievement.color]}`}
              >
                <div className="text-xl sm:text-2xl shrink-0">{achievement.icon}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-xs sm:text-sm text-heading truncate">{achievement.name}</p>
                  <p className="text-xs text-muted line-clamp-2">{achievement.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Progress Bars */}
      {progress.length > 0 && (
        <div className="space-y-3 sm:space-y-4 pt-2 sm:pt-3 border-t surface-border">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-blue-500 shrink-0" />
            <h4 className="text-xs sm:text-sm font-semibold text-heading">Performance Metrics</h4>
          </div>
          <div className="space-y-3 sm:space-y-4">
            {progress.map((item) => (
              <div key={item.id} className="space-y-1.5 sm:space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs sm:text-sm font-medium text-heading truncate">{item.label}</span>
                  <span className="text-xs font-semibold text-muted shrink-0">{Math.round(item.value)}%</span>
                </div>
                <div className="relative h-2 sm:h-2.5 bg-[rgba(148,163,184,0.15)] dark:bg-[rgba(148,163,184,0.1)] rounded-full overflow-hidden">
                  <div
                    className={`absolute top-0 left-0 h-full ${progressColors[item.color]} transition-all duration-500 ease-out rounded-full`}
                    style={{ width: `${item.value}%` }}
                  />
                </div>
                <p className="text-xs text-muted leading-relaxed">{item.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Encouragement Message */}
      {achievements.length > 0 && (
        <div className="pt-2 sm:pt-3 border-t surface-border">
          <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-lg bg-gradient-to-r from-emerald-500/10 to-blue-500/10 border border-emerald-500/20 dark:border-emerald-500/30">
            <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
            <p className="text-xs sm:text-sm text-muted leading-relaxed">
              <span className="font-semibold text-heading">Great work!</span> Keep tracking your farm data to unlock more achievements and improve your performance metrics.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

