type Props = {
  regularPrice: number;
  discount: number;
  numNights: number;
  totalPrice: number;
  extrasPrice: number;
  hasBreakfast: boolean;
  hasSelection: boolean;
  onClear: () => void;
};

export default function ReservationPriceSummary({
  regularPrice,
  discount,
  numNights,
  totalPrice,
  extrasPrice,
  hasBreakfast,
  hasSelection,
  onClear,
}: Props) {
  return (
    <div className='flex items-center justify-between px-8 bg-accent-500 text-primary-800 h-[72px]'>
      <div className='flex items-baseline gap-6'>
        <p className='flex gap-2 items-baseline'>
          {discount > 0 ? (
            <>
              <span className='text-2xl'>${regularPrice - discount}</span>
              <span className='line-through font-semibold text-primary-700'>
                ${regularPrice}
              </span>
            </>
          ) : (
            <span className='text-2xl'>${regularPrice}</span>
          )}
          <span>/night</span>
        </p>

        {numNights ? (
          <>
            <p className='bg-accent-600 px-3 py-2 text-2xl'>
              <span>&times;</span> <span>{numNights}</span>
            </p>
            <p>
              <span className='text-lg font-bold uppercase'>Total</span>{' '}
              <span className='text-2xl font-semibold'>${totalPrice}</span>
              {hasBreakfast && extrasPrice > 0 ? (
                <span className='block text-xs font-medium'>
                  Includes ${extrasPrice} breakfast
                </span>
              ) : null}
            </p>
          </>
        ) : null}
      </div>

      {hasSelection ? (
        <button
          type='button'
          className='border border-primary-800 py-2 px-4 text-sm font-semibold'
          onClick={onClear}
        >
          Clear
        </button>
      ) : null}
    </div>
  );
}
