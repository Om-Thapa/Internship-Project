import React from 'react'
import { Button } from './ui/button'

const Navbar = () => {
  return (
    <div className='z-50 fixed top-0 bg-white w-full'>
        <div className='flex justify-between items-center w-full my-2'>
            <div aria-label='Logo' className='ml-10 px-5 py-4 text-xl font-semibold rounded-2xl bg-green-400/80'>Logo</div>
            {/* <div className='px-9 py-4'>
                <Button className='text-sm p-5'>Sign In</Button>
            </div> */}
        </div>
        <hr className="mx-auto w-14/15 h-0.5 bg-green-500"/>
    </div>
  )
}

export default Navbar