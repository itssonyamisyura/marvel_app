import '../../components/spinner/spinner.scss'

const Spinner = () => {
    return (
      <div className="marvel-spinner">
        <div className="marvel-spinner__ring"></div>
        <div className="marvel-spinner__text">MARVEL LOADING</div>
      </div>
    );
  }

export default Spinner;