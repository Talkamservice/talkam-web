import React, { useMemo, useState } from 'react'
import classNames from 'classnames'
import DefaultAvatar from '../../assets/icons/profile.svg'

export const Avatar = ({ src, size }) => {

    const [hasError, setHasError] = useState(false);

    const baseClass = classNames('flex items-center justify-center rounded-full border border-tgray-xlight rounded-full')
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
            <div className={classNames(baseClass,'bg-tgray-75', sizeMap[size] ?? largeClass)}>
                <img
                    loading='lazy'
                    className={classNames(baseClass, sizeMap[size] ?? largeClass)}
                    style={{
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        objectFit: "cover",
                    }}
                    src={DefaultAvatar}
                    alt='profile'
                    onError={(event) => setHasError(true)}
                />
            </div>
        );

        if (hasImageSrc && !hasError)
        return (
            <div className={classNames(baseClass, sizeMap[size] ?? largeClass)}>
                <img
                    loading='lazy'
                    className={classNames(baseClass, sizeMap[size] ?? largeClass)}
                    style={{
                        backgroundSize: "cover",
                        backgroundRepeat: "no-repeat",
                        objectFit: "cover",
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