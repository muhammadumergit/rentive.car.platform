import React, { useEffect, useState } from 'react'
import Title from '../../components/owner/Title'
import { useAppContext } from '../../context/AppContext'
import toast from 'react-hot-toast'

const ManageBookings = () => {

  const { currency, axios } = useAppContext()

  const [bookings, setBookings] = useState([])

  const fetchOwnerBookings = async () => {
    try {
      const { data } = await axios.get('/api/bookings/owner')
      data.success ? setBookings(data.bookings) : toast.error(data.message)
    } catch (error) {
      toast.error(error.message)
    }
  }

  const changeBookingStatus = async (bookingId, status) => {
    try {
      const { data } = await axios.post('/api/bookings/change-status', { bookingId, status })
      if (data.success) {
        toast.success(data.message)
        fetchOwnerBookings()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      toast.error(error.message)
    }
  }

  useEffect(() => {
    fetchOwnerBookings()
  }, [])

  return (
    <div className='px-4 pt-10 md:px-10 w-full'>

      <Title title="Manage Bookings" subTitle="Track all customer bookings, approve or cancel requests, and manage booking statuses." />

      <div className='max-w-4xl w-full rounded-md overflow-hidden border border-borderColor mt-6'>

        <table className='w-full border-collapse text-left text-sm text-gray-600'>
          <thead className='text-gray-500 bg-gray-50'>
            <tr>
              <th className="p-3 font-medium">Car</th>
              <th className="p-3 font-medium">Customer</th> {/* New Header */}
              <th className="p-3 font-medium max-md:hidden">Date Range</th>
              <th className="p-3 font-medium">Total</th>
              <th className="p-3 font-medium max-md:hidden">Payment</th>
              <th className="p-3 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking, index) => (
              <tr key={index} className='border-t border-borderColor text-gray-500 hover:bg-gray-50 transition-colors'>

                {/* Car Column */}
                <td className='p-3 flex items-center gap-3'>
                  <img src={booking.car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover' />
                  <div className='max-md:hidden'>
                    <p className='font-medium text-gray-800'>{booking.car.brand}</p>
                    <p className='text-xs'>{booking.car.model}</p>
                  </div>
                </td>

                {/* Customer Details Column (Name & Phone) */}
                <td className='p-3'>
                  <div className='flex flex-col'>
                    <p className='font-medium text-gray-800'>{booking.name || 'N/A'}</p>
                    <p className='text-xs text-primary font-medium'>{booking.phoneNumber || 'N/A'}</p>
                  </div>
                </td>

                {/* Date Range Column */}
                <td className='p-3 max-md:hidden'>
                  <div className='text-xs'>
                    <p>Pick: {booking.pickupDate.split('T')[0]}</p>
                    <p>Ret: {booking.returnDate.split('T')[0]}</p>
                  </div>
                </td>

                {/* Price Column */}
                <td className='p-3 font-medium text-gray-800'>{currency} {booking.price}</td>

                {/* Payment Status */}
                <td className='p-3 max-md:hidden'>
                  <span className='bg-gray-100 px-3 py-1 rounded-full text-[10px] uppercase font-bold text-gray-400'>offline</span>
                </td>

                {/* Actions Column */}
                <td className='p-3'>
                  {booking.status === 'pending' ? (
                    <select 
                      onChange={e => changeBookingStatus(booking._id, e.target.value)} 
                      value={booking.status} 
                      className='px-2 py-1.5 text-xs text-gray-500 border border-borderColor rounded-md outline-none bg-white cursor-pointer'
                    >
                      <option value="pending">Pending</option>
                      <option value="cancelled">Cancelled</option>
                      <option value="confirmed">Confirmed</option>
                    </select>
                  ) : (
                   <span
  className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold ${
    booking.status === 'confirmed'
      ? 'bg-green-100 text-green-600'
      : 'bg-red-100 text-red-600'
  }`}
>
    {booking.status}
                    </span>
                  )}
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default ManageBookings