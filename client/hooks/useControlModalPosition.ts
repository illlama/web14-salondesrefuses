import { useState, useEffect } from 'react';

const useControlModalPosition = () => {
    const [modalPositionBottom, setModalPositionBottom] = useState('-560px');

    const onClickHiddenModal = () => {
        setModalPositionBottom('10vh');
    };

    const onWheelModal = (e: WheelEvent) => {
        if (e.deltaY > 30) setModalPositionBottom('10vh');
        else if (e.deltaY < -30) setModalPositionBottom('-560px');
    };

    const handleModalPosition = (bottom: string) => {
        setModalPositionBottom(bottom);
    };

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        document.addEventListener('wheel', onWheelModal);
        return () => {
            document.body.style.overflow = 'visible';
            document.removeEventListener('wheel', onWheelModal);
        };
    }, []);

    return { modalPositionBottom, handleModalPosition, onClickHiddenModal };
};

export default useControlModalPosition;
