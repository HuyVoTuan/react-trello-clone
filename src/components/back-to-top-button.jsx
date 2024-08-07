import PropTypes from 'prop-types';
import debounce from '../helpers/debounce';
import { useState, useEffect, useCallback, forwardRef } from 'react';

// UI lib
import { Button, Tooltip } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

// Constants
const BACK_TO_TOP_LIMIT = 300;

const BackToTopButton = (props, ref) => {
  const [backToTopButton, setBackToTopButton] = useState(false);

  // Scroll to top
  const scrollTopHandler = () => {
    ref.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* WAY 1: THIS WAY IS SLOWER */
  // useEffect(() => {
  //   const handleScroll = debounce(() => {
  //     const currentScrollTop = scrollRef.current.scrollTop;
  //     setBackToTopButton(currentScrollTop > BACK_TO_TOP_LIMIT);
  //   }, 200);

  //   const scrollTopDiv = scrollRef.current;
  //   scrollTopDiv.addEventListener('scroll', handleScroll);

  //   return () => {
  //     scrollTopDiv.removeEventListener('scroll', handleScroll);
  //   };
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, []);

  /* WAY 2: THIS WAY IS FASTER */
  // Callback hooks
  const handleScroll = useCallback(() => {
    const debouncedHandleScroll = debounce(() => {
      const currentScrollTop = ref.current.scrollTop;
      setBackToTopButton(currentScrollTop > BACK_TO_TOP_LIMIT);
    }, 200); // Adjust the debounce delay as needed

    debouncedHandleScroll();
  }, [ref]);

  // Effect hooks
  useEffect(() => {
    const scrollTopDiv = ref.current;
    scrollTopDiv.addEventListener('scroll', handleScroll);

    return () => {
      scrollTopDiv.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll, ref]);

  return (
    <>
      {backToTopButton && (
        <Tooltip title="Scroll to top">
          <Button
            type="primary"
            shape="circle"
            icon={<ArrowUpOutlined />}
            className="absolute bottom-0 right-5"
            onClick={scrollTopHandler}
          />
        </Tooltip>
      )}
    </>
  );
};

export default forwardRef(BackToTopButton);

BackToTopButton.propTypes = {
  scrollRef: PropTypes.object.isRequired,
};
