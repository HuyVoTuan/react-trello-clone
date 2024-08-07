import PropTypes from 'prop-types';
import Header from './components/header';

export default function MainLayout({ children }) {
  return (
    <>
      <Header />
      {children}
    </>
  );
}

MainLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
