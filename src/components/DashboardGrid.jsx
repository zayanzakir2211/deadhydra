import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, useSortable, rectSortingStrategy, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useSettings } from '../context/SettingsContext'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { DEFAULT_WIDGET_ORDER } from '../utils/defaults'
import WidgetCard from './WidgetCard'

import Greeting from './widgets/Greeting'
import SearchBar from './widgets/SearchBar'
import TodoList from './widgets/TodoList'
import QuickLinks from './widgets/QuickLinks'
import Weather from './widgets/Weather'
import Quote from './widgets/Quote'
import PomodoroTimer from './widgets/PomodoroTimer'

const WIDGET_MAP = {
  greeting: { title: null, component: Greeting, span: 'sm:col-span-2 lg:col-span-3' },
  search: { title: null, component: SearchBar, span: 'sm:col-span-2 lg:col-span-3', bare: true },
  todos: { title: 'Todo List', component: TodoList, span: '' },
  links: { title: 'Quick Links', component: QuickLinks, span: '' },
  weather: { title: 'Weather', component: Weather, span: '' },
  quote: { title: 'Quote of the Day', component: Quote, span: '' },
  pomodoro: { title: 'Focus Timer', component: PomodoroTimer, span: '' },
}

function SortableWidget({ id }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }
  const cfg = WIDGET_MAP[id]
  if (!cfg) return null
  const Comp = cfg.component

  if (cfg.bare) {
    return (
      <div ref={setNodeRef} style={style} className={cfg.span}>
        <div {...attributes} {...listeners} className="flex justify-center">
          <Comp />
        </div>
      </div>
    )
  }

  return (
    <div ref={setNodeRef} style={style} className={cfg.span}>
      <WidgetCard title={cfg.title} dragHandleProps={{ ...attributes, ...listeners }}>
        <Comp />
      </WidgetCard>
    </div>
  )
}

export default function DashboardGrid() {
  const { settings } = useSettings()
  const [order, setOrder] = useLocalStorage('deadhydra:widgetOrder', DEFAULT_WIDGET_ORDER)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 6 } }))

  const visibleOrder = order.filter((id) => settings.widgetVisibility[id] !== false && WIDGET_MAP[id])

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    setOrder((prev) => {
      const oldIndex = prev.indexOf(active.id)
      const newIndex = prev.indexOf(over.id)
      return arrayMove(prev, oldIndex, newIndex)
    })
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={visibleOrder} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
          {visibleOrder.map((id) => (
            <SortableWidget key={id} id={id} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
