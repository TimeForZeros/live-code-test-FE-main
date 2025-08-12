import React from 'react'

const SlowImport = DelayedImport<React.FC>(() => import('./SlowImport'), 300);

// Assume this is a really large component
// (Pretend it's a real component that would just take a long time to load)
export default function ReallyLargeComponent() {
    return <>
        I am a really large component.
        <SlowImport />
    </>
}

// Used to ensure the component import is delayed
type ImportFunc<T extends React.ComponentType<any>> = () => Promise<{ default: T }>;

export function DelayedImport<T extends React.ComponentType<any>>(
    importFunc: ImportFunc<T>,
    delay: number
): React.LazyExoticComponent<T> {
    return React.lazy(() =>
        new Promise<{ default: T }>((resolve) => {
            setTimeout(() => resolve(importFunc()), delay);
        })
    );
}

// ------------------------
// YOU CAN IGNORE THIS FILE 
// ------------------------