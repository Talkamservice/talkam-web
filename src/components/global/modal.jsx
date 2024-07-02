import classNames from 'classnames';
import * as React from 'react';
// import { Zoom } from 'react-awesome-reveal';
import { createPortal } from 'react-dom';

const modalOverlayBase = classNames(
  'fixed',
  'flex',
  'flex-col',
  'justify-center',
  'overflow-hidden',
  'z-40',
  'bg-tgray-300',
  'bg-opacity-10',
  'backdrop-blur-sm',
  'left-0',
  'right-0',
  'top-0',
  'bottom-0',
  'transition',
  'delay-150',
  'duration-700',
  'ease-in-out',
  'md:p-10',
  'p-5'
);
const modalContentBase = classNames(
  'body-font font-avenir',
  'rounded-xl',
  'relative',
  'w-full',
  'overflow-y-scroll',
  'max-h-full',
  'max-w-full',
  'no-scrollbar',
  // 'border-2',
  // 'border-tgray-100',
);
const positionTop = classNames('items-start');
const positionCenter = classNames('items-center');
const positionBottom = classNames('items-end');

export const Modal = ({
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
    [positionTop]: position === 'top',
    [positionCenter]: position === 'center',
    [positionBottom]: position === 'bottom',
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
      <div onClose={onClose} className={modalContentClass} onClick={(e) => e.stopPropagation()}>
        <div className=''>
          <div className={`w-full ${headpadding}`}>{headFragment}</div>
          <div className={`w-full ${bodypadding}`}>{children}</div>
          <div className="w-full">{footerFragment}</div>
        </div>
      </div>
    </div>,
    containerId
  );
};

Modal.defaultProps = {
  contentWidth: 'w-max',
  position: 'center',
  contentBgColor: 'bg-twhite-100',
  shouldCloseOnOverlayClick: false,
  shouldCloseOnEscPress: false,
};