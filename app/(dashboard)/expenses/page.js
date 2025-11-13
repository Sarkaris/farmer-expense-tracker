"use client";

import SectionCard from "@/components/SectionCard";
import ExpenseForm from "@/components/ExpenseForm";
import ExpenseTable from "@/components/ExpenseTable";
import { useDashboard } from "@/components/DashboardProvider";

export default function ExpensesPage() {
  const { crops, expenses, handleAddExpense, disableForms, error } = useDashboard();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-4 sm:space-y-6 px-3 sm:px-4 py-4 sm:py-8 lg:px-10">
      {error ? <div className="alert-error text-xs sm:text-sm p-3 sm:p-4">{error}</div> : null}
      <SectionCard
        title="Expense Tracking"
        description="Record fertiliser, labour, machinery, and shared inputs. Shared costs are automatically split using crop acreage."
      >
        <ExpenseForm crops={crops} onCreate={handleAddExpense} disabled={disableForms} />
        <ExpenseTable expenses={expenses} crops={crops} />
      </SectionCard>
    </div>
  );
}


