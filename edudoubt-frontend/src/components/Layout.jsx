import PropTypes from 'prop-types';

function Layout({ children }) {
  return (
    <div className="app-container">
      <header className="app-header">
        <div className="app-header-content">
          <div className="app-logo">
            <span style={{ color: 'white', fontSize: '1.5rem' }}>📚</span> EduDoubt
          </div>
          <nav className="nav-menu">
            <a href="/home">Home</a>
            <a href="/ask-doubt">Ask Doubt</a>
            <a href="/my-doubts">My Doubts</a>
            <a href="/" onClick={() => {
              localStorage.clear();
            }}>Logout</a>
          </nav>
        </div>
      </header>

      <main className="app-content">
        {children}
      </main>

      <footer>
        <p>&copy; 2025 EduDoubt. All rights reserved.</p>
        <p>Making education clearer, one doubt at a time.</p>
      </footer>
    </div>
  );
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Layout;
