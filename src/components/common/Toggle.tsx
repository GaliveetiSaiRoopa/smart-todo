
const Toggle = ({ name, width, showPadding = true, label, bool, handleToggle }: any) => {
    return (
        <button onClick={() => handleToggle(name, bool)} className={`flex items-center text-start gap-2 w-full justify-between ${showPadding ? 'px-3' : ''}`}>
            {/* <div><p className={`text-sm font-medium text-primaryDark ${width || 'min-w-24'}`}>{label}</p></div> */}
            <img src={`${bool ? "/icons/switchActive.svg" : "/icons/switchInactive.svg"}`} alt="switch-toggle" className='w-10 h-10' />
        </button>
    )
}


export default Toggle