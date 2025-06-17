export interface BaseWidget {
  id: string;
  type: string;
  title: string;
  position: {
    x: number;
    y: number;
  };
  size: {
    width: number;
    height: number;
  };
  config: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface WeatherWidget extends BaseWidget {
  type: 'weather';
  config: {
    location: string;
    units: 'celsius' | 'fahrenheit';
    showForecast: boolean;
  };
}

export interface NewsWidget extends BaseWidget {
  type: 'news';
  config: {
    category: string;
    sources: string[];
    maxItems: number;
  };
}

export interface CalculatorWidget extends BaseWidget {
  type: 'calculator';
  config: {
    theme: 'light' | 'dark';
    scientific: boolean;
  };
}

export interface ClockWidget extends BaseWidget {
  type: 'clock';
  config: {
    timezone: string;
    format: '12h' | '24h';
    showDate: boolean;
    showSeconds: boolean;
  };
}

export interface TodoWidget extends BaseWidget {
  type: 'todo';
  config: {
    maxItems: number;
    showCompleted: boolean;
  };
}

export interface CalendarWidget extends BaseWidget {
  type: 'calendar';
  config: {
    view: 'month' | 'week' | 'agenda';
    showWeekends: boolean;
  };
}

export interface NotesWidget extends BaseWidget {
  type: 'notes';
  config: {
    backgroundColor: string;
    fontSize: number;
  };
}

export interface ChartWidget extends BaseWidget {
  type: 'chart';
  config: {
    chartType: 'line' | 'bar' | 'pie' | 'doughnut';
    dataSource: string;
    refreshInterval: number;
  };
}

export type Widget =
  | WeatherWidget
  | NewsWidget
  | CalculatorWidget
  | ClockWidget
  | TodoWidget
  | CalendarWidget
  | NotesWidget
  | ChartWidget;

export interface WidgetTemplate {
  id: string;
  type: string;
  name: string;
  description: string;
  icon: string;
  category: string;
  defaultSize: {
    width: number;
    height: number;
  };
  defaultConfig: Record<string, any>;
  previewImage?: string;
}

export interface Dashboard {
  id: string;
  name: string;
  description?: string;
  widgets: Widget[];
  layout: {
    columns: number;
    rows: number;
    gap: number;
  };
  theme: 'light' | 'dark';
  createdAt: Date;
  updatedAt: Date;
}

export interface DragItem {
  id: string;
  type: 'widget' | 'widget-type';
  widgetType?: WidgetType;
  index?: number;
}

export interface DropResult {
  draggedItem: DragItem;
  dropZone: string;
  position?: { x: number; y: number };
}

