export const Card = ({ title, action, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      {(title || action) && (
        <div className="flex items-center justify-between mb-4">
          {title && <h2 className="text-lg font-semibold text-gray-900">{title}</h2>}
          {action}
        </div>
      )}
      {children}
    </div>
  );
};

// src/modules/shared/components/ui/EmptyState.js
export const EmptyState = ({ icon: Icon, title, description, action }) => {
  return (
    <div className="text-center py-12">
      {Icon && (
        <div className="mx-auto w-12 h-12 text-gray-400 mb-4">
          <Icon className="w-full h-full" />
        </div>
      )}
      <h3 className="text-sm font-medium text-gray-900 mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-gray-500 mb-4">{description}</p>
      )}
      {action}
    </div>
  );
};