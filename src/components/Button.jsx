const Button = ({ children, onClick, variant = 'contained' }) => {

    if (variant === 'outlined') {
        return (
            <button
                className="
  rounded-full
  border border-purple-500
  px-5 py-2
  text-sm font-medium text-purple-500
  bg-transparent
  transition
  hover:bg-purple-500/10
  active:bg-purple-500/20
  focus:outline-none focus:ring-2 focus:ring-purple-500/60
"
onClick={onClick}
            >
                {children}
            </button>
        )
    }
    return (
        <button
            className="
    rounded-full
    bg-purple-600
    px-5 py-2
    text-sm font-medium text-white
    shadow-md shadow-purple-900/40
    transition
    hover:bg-purple-500
    active:bg-purple-700
    focus:outline-none focus:ring-2 focus:ring-purple-500/60
  "
  onClick={onClick}
        >
            {children}
        </button>
    )
}

export default Button