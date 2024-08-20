import classNames from 'classnames';
import * as React from 'react';
import { Slide } from 'react-awesome-reveal';
import { createPortal } from 'react-dom';

const modalOverlayBase = classNames(
    'fixed',
    'inset-0',
    'flex',
    'items-center',
    'overflow-hidden',
    'overflow-auto',
    'z-40',
    'bg-tblack-100',
    'bg-opacity-70',
    'backdrop-blur-sm',
    'transition',
    'delay-150',
    'duration-700',
    'ease-in-out',
    'p-2'
);
const modalContentBase = classNames(
    'rounded-sm',
    'relative',
    'w-full',
    'h-full',
    'overflow-auto',
    'overflow-y-scroll',
    'max-h-full',
    'max-w-full',
    'no-scrollbar',
);
const positionRight = classNames('justify-end');
const positionLeft = classNames('justify-start');

export const DrawerModal = ({
    show,
    headpadding,
    bodypadding,
    onClose,
    children,
    position,
    headFragment,
    contentWidth,
    contentBgColor,
    footerFragment,
    shouldCloseOnEscPress,
    shouldCloseOnOverlayClick,
}) => {
    const containerId = document.getElementsByTagName('body')[0];

    //when overlay is clicked
    const handleOverlayClick = React.useCallback(() => {
        if (shouldCloseOnOverlayClick && !!onClose) onClose();
    }, [onClose, shouldCloseOnOverlayClick]);

    // on ESC key press
    const closeOnEscapeKeyPress = React.useCallback(
        (e) => {
            if (e.key === 'Escape' && shouldCloseOnEscPress) {
                if (!!onClose) onClose();
            }
        },
        [onClose, shouldCloseOnEscPress]
    );

    React.useEffect(() => {
        document.addEventListener('keydown', closeOnEscapeKeyPress);
        return () => {
            document.addEventListener('keydown', closeOnEscapeKeyPress);
        };
    }, [closeOnEscapeKeyPress]);

    const modalOverlayClass = classNames(modalOverlayBase, {
        [positionLeft]: position === 'left',
        [positionRight]: position === 'right',
    });
    const modalContentClass = classNames(
        modalContentBase,
        contentBgColor,
        contentWidth,
        headpadding,
        bodypadding,
    );

    if (!show) return null;
    return createPortal(
        <div
            role="dialog"
            className={modalOverlayClass}
            onClick={handleOverlayClick}
        >
            <Slide
                onClose={onClose}
                direction={position}
                duration={400}
                className={modalContentClass}
            >
                <div onClick={(e) => e.stopPropagation()}>
                    <div className={`w-full ${headpadding}`}>{headFragment}</div>
                    <div className={`w-full ${bodypadding}`}>{children}</div>
                    <div className="w-full">{footerFragment}</div>
                </div>
            </Slide>
        </div>,
        containerId
    );
};

DrawerModal.defaultProps = {
    contentWidth: 'w-1/3',
    position: 'right',
    contentBgColor: 'bg-twhite-100',
    shouldCloseOnOverlayClick: true,
    shouldCloseOnEscPress: true,
};