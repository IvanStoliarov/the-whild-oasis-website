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
        <StarRating bookingId={bookingId} />
      </Modal.Window>
    </Modal>
  );
}
