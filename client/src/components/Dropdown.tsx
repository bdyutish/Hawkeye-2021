import React, { ReactElement } from 'react';

interface Props {}

export default function Dropdown({}: Props): ReactElement {
  return <div></div>;
}

// import React, { ReactElement } from 'react';
// import useClickOut from '../hooks/useClickOut';
// import { Nullable } from '../utils/types';

// interface Props {
//   options: {
//     label: string;
//     value: string;
//   }[];
//   defaultIndex?: number;
//   setter: any;
//   width?: number;
// }

// const DropdownDiv = styled.div<{ open: boolean; width: number }>`
//   /* min-width: max-content; */
//   min-width: ${(props) => `${props.width}rem`};
//   /* height: 3.5rem; */
//   position: relative;

//   /* transition: 0.5s all; */
//   /* border-top-left-radius: 5px; */
//   /* border-top-right-radius: 5px; */
//   /* padding: 0.5rem 0.25rem; */
//   /* width: max-content;  */
// `;

// const DropdownTop = styled.div<{ open: boolean; width: number }>`
//   display: flex;
//   align-items: center;
//   box-shadow: ${(props) => (props.open ? '0 0 8px #21212144' : '')};
//   min-width: ${(props) => `${props.width}rem`};
//   width: max-content;
//   padding: 0.1rem;
//   transition: 0.4s box-shadow;
//   border-top-left-radius: 5px;
//   border-top-right-radius: 5px;
//   border-bottom: ${(props) => (props.open ? '1px solid #ddd' : '')};
//   cursor: pointer;

//   img {
//     transform: translateY(0.2rem);
//     transition: 0.4s all;
//     transform: ${(props) =>
//       props.open
//         ? 'rotate(180deg) translateY(-0.13rem)'
//         : 'translateY(0.2rem)'};
//     width: 2rem;
//   }

//   h4 {
//     font-size: 1.7rem;
//     margin-left: 0.5rem;
//   }
// `;
// const DropdownList = styled.div<{ open: boolean; width: number }>`
//   box-shadow: ${(props) => (props.open ? '0 8px 8px #21212144' : '')};
//   transition: 0.4s all;
//   min-width: ${(props) => `${props.width}rem`};
//   width: max-content;
//   position: absolute;
//   bottom: 0;
//   transform: translateY(100%);
//   border-bottom-left-radius: 5px;
//   border-bottom-right-radius: 5px;

//   background-color: white;
//   z-index: 500;
//   .option {
//     padding: 0.1rem;
//     cursor: pointer;
//     font-size: 1.7rem;
//     padding-left: 2.5rem;
//     transition: 0.1s all;
//     &:hover {
//       background-color: #ddd;
//     }
//   }
// `;

// export default function Dropdown({
//   options,
//   defaultIndex = 0,
//   setter,
//   width,
// }: Props): Nullable<ReactElement> {
//   const [open, setOpen] = React.useState(false);
//   const [currentOption, setCurrentOption] = React.useState(defaultIndex);

//   const divRef = React.useRef<HTMLDivElement>(null);

//   useClickOut(
//     divRef,
//     () => {},
//     () => {
//       setOpen(false);
//     }
//   );

//   React.useEffect(() => {
//     setter(options[defaultIndex].value);
//   }, []);

//   if (Object.keys(options).length === 0) return null;
//   return (
//     <DropdownDiv open={open} width={width || 17} ref={divRef}>
//       <DropdownTop
//         open={open}
//         width={width || 17}
//         onClick={() => setOpen((prev) => !prev)}
//       >
//         <div className="img">
//           <img src={arrow} alt="down_arrow" />
//         </div>
//         <h4>{options[currentOption].label}</h4>
//       </DropdownTop>
//       {open && (
//         <DropdownList open={open} width={width || 17}>
//           {options.map((option: any, index: number) => {
//             return (
//               <div
//                 onClick={() => {
//                   setCurrentOption(index);
//                   setOpen(false);
//                   setter(options[index].value);
//                 }}
//                 key={option.value}
//                 className="option"
//               >
//                 <h4> {option.label} </h4>
//               </div>
//             );
//           })}
//         </DropdownList>
//       )}
//     </DropdownDiv>
//   );
// }
