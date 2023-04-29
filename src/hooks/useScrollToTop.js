import { useEffect } from 'react';

const useScrollToTop = () => {
  useEffect(() => {
    window.scroll({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
  }, []);
};

export default useScrollToTop;
