import React from 'react'
import { Link } from 'react-router'
import {PlusIcon, UserIcon} from 'lucide-react'


const NavBar = () => {
  return (
    <header className="bg-base-300 border-b border-base-content/10">

    <div className='mx-auto max-w-6xl p-4'>
        <div className='flex items-center justify-between'>
            <h1 className='text-3xl font-bold text-primary font-mono tracking-tighter'>m1rabil1z wall-of-shame</h1>
            <div className='flex items-center gap-4'>
                <Link to={"/create"} className='btn btn-primary'>
                <PlusIcon className='size-5'/>
                <span>New Snippet</span>
                </Link>
                <Link to="/profile" className="avatar placeholder btn btn-circle btn-ghost border border-base-content/20 hover:bg-base-content/10 transition-all">
                    <div className="bg-neutral text-neutral-content rounded-full w-10 h-10 flex items-center justify-center">
                      <UserIcon className="size-5 text-gray-400" />
                    </div>
                </Link>
            </div>

        </div>

    </div>


    </header>
  )
}

export default NavBar