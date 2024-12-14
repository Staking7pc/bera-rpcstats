import React from 'react'
import './Header.css'

export default function Header() {
  return (
    <div>
      <ul>
        <li className='li'>
          <a class="" href="https://brightlystake.com">Brightlystake</a>
        </li>
        <li className='li-r'><a class="active" href="/rpc-status">RPC</a></li>
        <li className='li-r'><a class="active" href="/evm-rpc-status">EVM-RPC</a></li>
        <li className='li-r'><a class="active" href="/wss-status">WSS</a></li>
        {/* <li className='li-r'><a class="active" href="/seed-status">seeds/peers-test</a></li> */}
        <li className='li-r'><a class="active" href="/">Home</a></li>
      </ul>
    </div>
  )
}
