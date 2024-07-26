import React, { useMemo, useState } from 'react'
import classNames from 'classnames'
import DefaultAvatar from '../../assets/icons/profile.svg'

export const Avatar = ({ src, size, onClick, ...props }) => {

    const [hasError, setHasError] = useState(false);

    const baseClass = classNames('flex items-center justify-center rounded-full bg-white border border-tgray-xlight p-0 m-0')
    const xtrasmallClass = classNames('w-8 h-8')
    const smallMediumClass = classNames('w-10 h-10')
    const smallClass = classNames('w-12 h-12')
    const mediumClass = classNames('w-16 h-16')
    const largeClass = classNames('w-20 h-20')
    const exLargeClass = classNames('w-24 h-24')
    const xxLargeClass = classNames('w-32 h-32')

    const sizeMap = {
        "xs": xtrasmallClass,
        "xsm": smallMediumClass,
        "sm": smallClass,
        "md": mediumClass,
        "lg": largeClass,
        "xl": exLargeClass,
        "2xl": xxLargeClass,
    }

    const getAvatar = useMemo(() => {

        const hasImageSrc = !!src && src?.length;

        if ((!hasImageSrc) || hasError)
        return (
            <div {...props} onClick={onClick} className={classNames(baseClass, sizeMap[size] ?? largeClass)}>
                <img
                    loading='lazy'
                    className={classNames(baseClass, sizeMap[size] ?? largeClass)}
                    style={{
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        objectFit: "contain",
                    }}
                    src={DefaultAvatar}
                    alt='profile'
                    onError={(event) => setHasError(true)}
                />
            </div>
        );

        if (hasImageSrc && !hasError)
        return (
            <div {...props} onClick={onClick} className={classNames(baseClass, sizeMap[size] ?? largeClass)}>
                <img
                    loading='lazy'
                    className={classNames(baseClass, sizeMap[size] ?? largeClass)}
                    style={{
                        backgroundSize: "contain",
                        backgroundRepeat: "no-repeat",
                        objectFit: "contain",
                    }}
                    src={src}
                    alt='profile'
                    onError={(event) => setHasError(true)}
                />
            </div>
        );

        if (hasError) return null;
        return null;

    },[src, size, hasError])

    return getAvatar;
}