import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md mb-60">
        <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
          <div className='flex justify-center p-5'>
            <SignUp />
          </div>
        </div>
    </div>
  )
}