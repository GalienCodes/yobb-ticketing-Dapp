import { useGlobalState } from "store"

const Loading = () => {
  const [loading] = useGlobalState('loading')

  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen z-40
      flex items-center justify-center bg-black font-globalFont
      bg-opacity-50 transform transition-transform 
      duration-300 ${loading.show ? 'scale-100' : 'scale-0'}`}
    >
      <div
        className="flex flex-col justify-center
        items-center 
        min-w-min "
      >
        <div className="flex flex-row justify-center items-center">
          <div className="lds-dual-ring scale-50"></div>
          <p className="text-4xl font-semibold text-white">Processing...</p>
        </div>
        <small className="text-white text-base font-medium">{loading.msg}</small>
      </div>
    </div>
  )
}

export default Loading