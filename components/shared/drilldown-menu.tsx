'use client';
import { cn } from '@/lib/utils/tailwind-merge';
import React, {
    createContext,
    Dispatch,
    HTMLAttributes,
    MouseEvent,
    MouseEventHandler,
    ReactNode,
    RefObject,
    SetStateAction,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { useOnClickOutside } from 'usehooks-ts';

// #region Main Context
// ======================================
type DrilldownMenuContextType = {
    isOpen: boolean;
    stack: RefObject<HTMLDivElement>[];
    goForward: (ref: RefObject<HTMLDivElement>) => void;
    goBack: () => void;
    open: () => void;
    close: () => void;
    rootContentRef: RefObject<HTMLDivElement>;
    setHeightTrigger: Dispatch<SetStateAction<number>>;
};

const DrilldownMenuContext = createContext<DrilldownMenuContextType | null>(null);

// #region Main Menu
// ======================================
export function DrilldownMenu({ children, className }: HTMLAttributes<HTMLDivElement>) {
    const [isOpen, setIsOpen] = useState(false);
    const rootContentRef = useRef<HTMLDivElement>(null!);
    const rootRef = useRef<HTMLDivElement>(null!);
    const [stack, setStack] = useState<RefObject<HTMLDivElement>[]>([rootContentRef]);
    const [heightTrigger, setHeightTrigger] = useState(0);

    const open = useCallback(() => {
        setIsOpen(true);
        setStack([rootContentRef]);
    }, []);

    const close = useCallback(() => {
        setIsOpen(false);
        setStack([]);
    }, []);

    const goForward = useCallback((ref: RefObject<HTMLDivElement>) => {
        setStack((prev) => [...prev, ref]);
    }, []);

    const goBack = useCallback(() => {
        setStack((prev) => prev.slice(0, -1));
    }, []);

    useOnClickOutside(rootRef, close);

    const contextValue = useMemo(
        () => ({
            isOpen,
            stack,
            rootContentRef,
            goForward,
            goBack,
            open,
            close,
            setHeightTrigger,
        }),
        [isOpen, stack, goForward, goBack, open, close],
    );

    return (
        <DrilldownMenuContext.Provider value={contextValue}>
            <div className={cn('relative', className)} style={{ height: heightTrigger }} ref={rootRef}>
                {children}
            </div>
        </DrilldownMenuContext.Provider>
    );
}

// #region Main Trigger
// ======================================
export const DrilldownMenuTrigger = ({ children, className }: HTMLAttributes<HTMLDivElement>) => {
    const ctx = useContext(DrilldownMenuContext);

    const triggerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (triggerRef.current) ctx?.setHeightTrigger(triggerRef.current.clientHeight);
    }, [ctx]);

    return (
        <div ref={triggerRef} className={className} onClick={ctx?.open}>
            {children}
        </div>
    );
};

type Position =
    | 'top-left'
    | 'top-center'
    | 'top-right'
    | 'center-left'
    | 'center-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-right';

const positionClasses = {
    'top-left': 'bottom-[calc(100%+4px)] right-0',
    'top-center': 'bottom-[calc(100%+4px)] left-1/2 transform -translate-x-1/2',
    'top-right': 'bottom-[calc(100%+4px)] left-0',
    'center-left': 'top-1/2 right-full transform -translate-y-1/2',
    'center-right': 'top-1/2 left-full transform -translate-y-1/2',
    'bottom-left': 'top-[calc(100%+4px)] right-0',
    'bottom-center': 'top-[calc(100%+4px)] left-1/2 transform -translate-x-1/2',
    'bottom-right': 'top-[calc(100%+4px)] left-0',
};

// #region Main Content
// ======================================
export const DrilldownMenuContent = React.memo(
    ({
        children,
        position = 'bottom-left',
        className,
    }: {
        children: ReactNode;
        position?: Position;
        className?: string;
    }) => {
        const ctx = useContext(DrilldownMenuContext);

        if (!ctx?.isOpen) return null;

        return (
            <div
                className={cn(
                    'absolute w-64 rounded-md border bg-background p-2 shadow-md overflow-hidden',
                    positionClasses[position],
                    className,
                )}
            >
                {ctx?.stack?.length && ctx.stack?.length > 1 ? (
                    <button className="mb-2 text-sm text-gray-500 cursor-pointer" onClick={ctx.goBack}>
                        ← Back
                    </button>
                ) : null}
                {children}
            </div>
        );
    },
);

// #region Item
// ======================================
interface DrilldownMenuItemProps {
    children: ReactNode;
    unstyled?: boolean;
    onCloseWhenClick?: boolean;
    className?: string;
    onClick?: MouseEventHandler<HTMLDivElement>;
}

export const DrilldownMenuItem = React.memo(
    ({
        children,
        unstyled = false,
        onCloseWhenClick = false,
        className,
        onClick,
        ...props
    }: DrilldownMenuItemProps) => {
        const ctx = useContext(DrilldownMenuContext);
        const subCtx = useContext(DrilldownMenuSubCtx);

        const [stack, setStack] = useState<RefObject<HTMLDivElement>[]>([]);

        useEffect(() => {
            if (ctx?.stack) setStack(ctx.stack);
        }, [ctx?.stack]);

        const handleClick = (e: MouseEvent<HTMLDivElement>) => {
            if (onClick) onClick(e);
            if (onCloseWhenClick) ctx?.close();
        };

        const Item = () => {
            const classNameCus = cn(
                `${unstyled ? '' : 'flex cursor-pointer items-center rounded-md px-3 py-2 hover:bg-input'}`,
                className,
            );

            return (
                <div className={classNameCus} onClick={handleClick} {...props}>
                    {children}
                </div>
            );
        };

        //  Root item
        if (stack?.length === 1 && !subCtx) {
            return <Item />;
        }
        // Sub item visible only if current submenu is active
        if (stack?.[stack?.length - 1]?.current === subCtx?.subContentRef?.current) {
            return <Item />;
        }

        return null;
    },
);

// #region Sub Context
// ======================================
type DrilldownMenuSubCtxType = {
    openSubMenu: () => void;
    subContentRef: RefObject<HTMLDivElement>;
    parentContentRef: RefObject<RefObject<HTMLDivElement>>;
};

const DrilldownMenuSubCtx = createContext<DrilldownMenuSubCtxType | undefined>(undefined);

// #region Sub Menu
// ======================================
export function DrilldownMenuSub({ children, className }: HTMLAttributes<HTMLDivElement>) {
    const ctx = useContext(DrilldownMenuContext);
    const parentCtx = useContext(DrilldownMenuSubCtx);

    const subContentRef = useRef<HTMLDivElement>(null!);
    const parentContentRef = useRef<RefObject<HTMLDivElement>>(parentCtx?.subContentRef ?? ctx!.rootContentRef);

    const openSubMenu = useCallback(() => {
        ctx?.goForward(subContentRef);
    }, [ctx]);

    const value = useMemo(
        () => ({ subContentRef, parentContentRef, openSubMenu }),
        [subContentRef, parentContentRef, openSubMenu],
    );

    return (
        <DrilldownMenuSubCtx.Provider value={value}>
            <div className={className}>{children}</div>
        </DrilldownMenuSubCtx.Provider>
    );
}

// #region Sub Trigger
// ======================================
interface DrilldownMenuSubTriggerProps {
    children: ReactNode;
    className?: string;
}

export const DrilldownMenuSubTrigger = React.memo(({ children, className }: DrilldownMenuSubTriggerProps) => {
    const ctx = useContext(DrilldownMenuContext);
    const subCtx = useContext(DrilldownMenuSubCtx);

    const [stack, setStack] = useState<RefObject<HTMLDivElement>[]>([]);
    const [parentContentRef, setParentRef] = useState<RefObject<RefObject<HTMLDivElement>> | null>(null);

    useEffect(() => {
        if (ctx?.stack) setStack(ctx.stack);
    }, [ctx?.stack]);

    useEffect(() => {
        if (subCtx?.parentContentRef) setParentRef(subCtx.parentContentRef);
    }, [subCtx?.parentContentRef]);

    if (stack?.[stack.length - 1]?.current !== parentContentRef?.current?.current) {
        return null;
    }

    return (
        <div
            className={cn(
                'flex cursor-pointer items-center justify-between rounded-md px-3 py-2 hover:bg-input',
                className,
            )}
            onClick={subCtx?.openSubMenu}
        >
            {children}
            <span>›</span>
        </div>
    );
});

// #region Sub Content
// ======================================
export const DrilldownMenuSubContent = React.memo(({ children, className }: HTMLAttributes<HTMLDivElement>) => {
    const subCtx = useContext(DrilldownMenuSubCtx);

    return (
        <div ref={subCtx?.subContentRef} className={className}>
            {children}
        </div>
    );
});
