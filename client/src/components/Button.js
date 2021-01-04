// import React from 'react'
// import './Button.css'

// const STYLES = [
//     'btn--primary',
//     'btn--outline'
// ]

// const SIZES = [
//     'btn--medium',
//     'btn--large'
// ]

// export const Button = ({
//     childern,
//     type,
//     onClick,
//     buttonStyle,
//     buttonSize
// }) => {
//     const checkButtonStyle = STYLES.includes(buttonStyle) ? buttonStyle : STYLES[0]

//     const checkButtonSize = SIZES.includes(buttonSize) ? buttonSize : SIZES[0]

//     return (
//         < button Class={`btn ${checkButtonStyle} ${checkButtonSize}`} onClick={onClick} type={type}>
//             {childern}
//         </button>
//     )
// }