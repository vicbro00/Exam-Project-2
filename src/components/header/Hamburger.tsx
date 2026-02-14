import "./hamburger.css";

/* Hamburger menu code adapted from: https://khuang159.medium.com/creating-a-hamburger-menu-in-react-f22e5ae442cb */
export default function Hamburger() {
  return (
    <>
      <div className="hamburger-menu d-block d-md-none">
        <div className="bar bar1"></div>
        <div className="bar bar2"></div>
        <div className="bar bar3"></div>
      </div>
    </>
  );
}