export function LoadingState({ label = 'Loading…' }) { return <div className="status-state" role="status" aria-live="polite"><span className="status-spinner" aria-hidden="true" />{label}</div> }

export function ErrorState({ message = 'Something went wrong.', onRetry }) { return <div className="status-state status-error" role="alert"><p>{message}</p>{onRetry && <button type="button" className="dark-button mt-4" onClick={onRetry}>Try again</button>}</div> }

export function EmptyState({ title = 'Nothing here yet.', description = 'Content will appear here once it is published.' }) { return <div className="status-state"><h3>{title}</h3><p>{description}</p></div> }
