import { Badge } from '@/components/ui/badge';
import type { ProductLocale } from '@/components/product/product-locale';
import { PUBLIC_PAGE_COPY } from '@/lib/product-i18n';
import { cn } from '@/lib/utils';

interface Task {
  id: string;
  title: string;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  assignee?: string;
  dueDate?: string;
}

const TASK_PRIORITY: Record<string, Array<Task['priority']>> = {
  backlog: ['high', 'medium', 'low'],
  inProgress: ['high', 'medium'],
  done: ['high', 'medium'],
};

export function Roadmap({ locale }: { locale: ProductLocale }) {
  const copy = PUBLIC_PAGE_COPY[locale].roadmap;
  const columns = {
    backlog: copy.tasks.backlog.map((title, index) => ({
      id: `backlog-${index}`,
      title,
      priority: TASK_PRIORITY.backlog[index] ?? 'medium',
      dueDate: '2026 Q3',
    })),
    inProgress: copy.tasks.inProgress.map((title, index) => ({
      id: `in-progress-${index}`,
      title,
      priority: TASK_PRIORITY.inProgress[index] ?? 'medium',
      dueDate: '2026 Q2',
    })),
    done: copy.tasks.done.map((title, index) => ({
      id: `done-${index}`,
      title,
      priority: TASK_PRIORITY.done[index] ?? 'low',
      dueDate: '2026 Q2',
    })),
  } satisfies Record<string, Task[]>;

  return (
    <div className="grid w-full auto-rows-auto grid-cols-1 gap-4 md:grid-cols-2 md:auto-rows-fr lg:grid-cols-3">
      {Object.entries(columns).map(([columnValue, tasks]) => (
        <TaskColumn
          key={columnValue}
          value={columnValue}
          tasks={tasks}
          locale={locale}
          title={
            copy.columns[columnValue as keyof typeof copy.columns] ??
            columnValue
          }
        />
      ))}
    </div>
  );
}

interface TaskCardProps {
  task: Task;
  locale: ProductLocale;
}

function TaskCard({ task, locale }: TaskCardProps) {
  const priorities = PUBLIC_PAGE_COPY[locale].roadmap.priorities;

  return (
    <div className="rounded-md border bg-card p-3 shadow-sm">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-2">
          <span className="line-clamp-1 font-medium text-sm">{task.title}</span>
          <Badge
            variant="outline"
            className={cn(
              'pointer-events-none h-5 rounded-sm px-1.5 text-[11px] capitalize border-transparent',
              task.priority === 'high'
                ? 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-400'
                : task.priority === 'medium'
                  ? 'bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400'
                  : 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400'
            )}
          >
            {priorities[task.priority]}
          </Badge>
        </div>
        <div className="flex items-center justify-between text-muted-foreground text-xs">
          {task.assignee && (
            <div className="flex items-center gap-1">
              <div className="size-2 rounded-full bg-primary/20" />
              <span className="line-clamp-1">{task.assignee}</span>
            </div>
          )}
          {task.dueDate && (
            <time className="text-[10px] tabular-nums">{task.dueDate}</time>
          )}
        </div>
      </div>
    </div>
  );
}

interface TaskColumnProps {
  value: string;
  tasks: Task[];
  title: string;
  locale: ProductLocale;
}

function TaskColumn({ value, tasks, title, locale }: TaskColumnProps) {
  return (
    <div key={value} className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{title}</span>
          <Badge variant="secondary" className="pointer-events-none rounded-sm">
            {tasks.length}
          </Badge>
        </div>
      </div>
      <div className="flex flex-col gap-2 p-0.5">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} locale={locale} />
        ))}
      </div>
    </div>
  );
}
