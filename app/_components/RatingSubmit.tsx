import React from 'react';
import Modal from './Modal';
import StarRating from './StarRating';

interface RatingSubmitProps {
  bookingId: number;
}

export default function RatingSubmit({ bookingId }: RatingSubmitProps) {
  return (
    <Modal>
      <Modal.Trigger>
        <button className='bg-green-200 text-green-900 rounded-sm px-4 py-2'>
          Rate your staying
        </button>
      </Modal.Trigger>
      <Modal.Window>
        <>
          <h3 className='text-primary-900 text-2xl mb-2'>Rate your stay</h3>
          <StarRating bookingId={bookingId} />
        </>
      </Modal.Window>
    </Modal>
  );
}
