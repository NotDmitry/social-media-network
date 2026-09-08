import './style.css';

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className='footer'>
      <a className='link link_external' href='https://sidekick-software.com/' target='_blank' rel='noreferrer'>
        © {currentYear} sidekick
      </a>
    </footer>
  );
}

export default Footer;
