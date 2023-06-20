import { FaRegTimesCircle } from 'react-icons/fa'
import { BsCheck2Circle } from 'react-icons/bs'
import { useGlobalState } from 'store'

const Alert = () => {
  const [alert] = useGlobalState('alert')

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen z-50
      flex items-center justify-center bg-black 
      bg-opacity-50 transform transition-transform
      duration-300 ${alert.show ? 'scale-100' : 'scale-0'}`}
    >
      <div
        className="flex gap-4 justify-start items-center
        bg-[#fff] shadow-xl  rounded
       font-globalFont min-w-min py-2 px-2 "
      >
        {alert.color == 'red' ? (
          <>
            <FaRegTimesCircle className="text-red-600 text-4xl" />
           <p className="text-red-600 font-semibold text-base">{alert.msg}</p>
          </>
        ) : (
          <>
            <BsCheck2Circle className="text-green-600 text-4xl" />
            <p className="text-green-600 font-semibold text-base">{alert.msg}</p>
          </>
        )}
      </div>
    </div>
  )
}

export default Alert