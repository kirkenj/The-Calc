const Button = ({ value, callback, style }) => {
  return (
    <button onClick={callback} className={`${style} button`}>{value}</button>
  )
}

export default Button