import PropTypes from 'prop-types';
import { useState, useEffect } from 'react';
import debounce from '../helpers/debounce';

// UI lib
import { Button, Tooltip } from 'antd';
import { ArrowUpOutlined } from '@ant-design/icons';

const BACK_TO_TOP_LIMIT = 300;

export default function BackToTopButton({ scrollRef }) {
  const [backToTopButton, setBackToTopButton] = useState(false);

  useEffect(() => {
    const handleScroll = debounce(() => {
      const scrollTopDivPixels = scrollRef.current.scrollTop;

      if (scrollTopDivPixels > BACK_TO_TOP_LIMIT) {
        setBackToTopButton(true);
      } else {
        setBackToTopButton(false);
      }
    }, 200);

    const scrollTopDiv = scrollRef.current;
    scrollTopDiv.addEventListener('scroll', handleScroll);

    return () => {
      scrollTopDiv.removeEventListener('scroll', handleScroll);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scroll to top
  const scrollTopHandler = () => {
    scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {backToTopButton && (
        <Tooltip title="Scroll to top">
          <Button
            className="absolute bottom-0 right-5"
            type="primary"
            shape="circle"
            icon={<ArrowUpOutlined />}
            onClick={scrollTopHandler}
          />
        </Tooltip>
      )}
    </>
  );
}

BackToTopButton.propTypes = {
  scrollRef: PropTypes.object.isRequired,
};
