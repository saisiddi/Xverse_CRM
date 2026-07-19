import { forwardRef, useState, cloneElement } from 'react';
import { cn } from '../../lib/utils';

// Button with custom variant and size props
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
  size?: 'sm' | 'default' | 'lg' | 'icon';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'default', children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants: Record<string, string> = {
      primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500',
      danger: 'bg-danger-500 text-white hover:bg-danger-600 focus:ring-danger-500',
      ghost: 'bg-transparent hover:bg-gray-100 focus:ring-gray-500',
      outline: 'border border-gray-300 bg-white hover:bg-gray-50 focus:ring-primary-500',
    };
    
    const sizes: Record<string, string> = {
      sm: 'px-3 py-1.5 text-xs',
      default: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
      icon: 'p-2',
    };
    
    return (
      <button
        ref={ref}
        className={cn(baseStyles, variants[variant] || variants.primary, sizes[size] || sizes.default, className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export const Input = forwardRef<HTMLInputElement, React.InputHTMLAttributes<HTMLInputElement>>(
  ({ className, type = 'text', ...props }, ref) => {
    return (
      <input
        type={type}
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400',
          'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
          className
        )}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export const Select = forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm',
          'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
          className
        )}
        {...props}
      />
    );
  }
);

Select.displayName = 'Select';

export const Textarea = forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        className={cn(
          'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm placeholder:text-gray-400',
          'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
          className
        )}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';

export const Label = forwardRef<HTMLLabelElement, React.LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn('block text-sm font-medium text-gray-700 mb-1', className)}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';

export const Badge = forwardRef<HTMLSpanElement, React.HTMLAttributes<HTMLSpanElement> & { variant?: 'default' | 'success' | 'warning' | 'danger' | 'primary' | 'gray' }>(
  ({ className, variant = 'default', children, ...props }, ref) => {
    const variants: Record<string, string> = {
      default: 'bg-gray-100 text-gray-800',
      primary: 'bg-primary-100 text-primary-800',
      success: 'bg-success-100 text-success-600',
      warning: 'bg-warning-100 text-warning-600',
      danger: 'bg-danger-100 text-danger-600',
      gray: 'bg-gray-100 text-gray-600',
    };
    
    return (
      <span
        ref={ref}
        className={cn('inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium', variants[variant] || variants.default, className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Badge.displayName = 'Badge';

export const Card = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('bg-white rounded-xl border border-gray-200 shadow-sm', className)}
        {...props}
      />
    );
  }
);

Card.displayName = 'Card';

export const CardHeader = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('px-5 py-4 border-b border-gray-100', className)}
        {...props}
      />
    );
  }
);

CardHeader.displayName = 'CardHeader';

export const CardBody = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('p-5', className)}
        {...props}
      />
    );
  }
);

CardBody.displayName = 'CardBody';

export const Tabs = ({ 
  tabs, 
  activeTab, 
  onChange, 
  className 
}: { 
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
  className?: string;
}) => {
  return (
    <div className={cn('flex gap-1 bg-gray-100 rounded-lg p-1', className)}>
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={cn(
            'px-4 py-2 text-sm font-medium rounded-md transition-colors',
            activeTab === tab.id 
              ? 'bg-white text-primary-700 shadow-sm' 
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
          )}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  size = 'md',
  showClose = true 
}: { 
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showClose?: boolean;
}) => {
  if (!isOpen) return null;
  
  const sizes: Record<string, string> = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4',
  };
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className={cn('w-full bg-white rounded-xl shadow-xl', sizes[size] || sizes.md)}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            {showClose && (
              <button onClick={onClose} className="p-1 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
          <div className="p-5 max-h-[70vh] overflow-y-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export const Tooltip = ({ children, content }: { children: React.ReactElement<{ 'aria-describedby'?: string }>; content: string }) => {
  const [visible, setVisible] = useState(false);
  
  return (
    <div className="relative inline-block" onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}>
      {cloneElement(children, { 'aria-describedby': visible ? 'tooltip' : undefined })}
      {visible && (
        <div id="tooltip" className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg shadow-lg whitespace-nowrap z-50 animate-slide-in">
          {content}
        </div>
      )}
    </div>
  );
};