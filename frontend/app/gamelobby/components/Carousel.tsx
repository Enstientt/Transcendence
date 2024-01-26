import standardMap from '@/public/static/images/standardMap3.png';
import pongOld from '@/public/static/images/pongOld2.png';
import Image, { StaticImageData } from 'next/image';
import { useDispatch } from 'react-redux';
import { mapType, setMapChoice } from '../GlobalRedux/features';

// CarouselItem.tsx
const CarouselItem = ({
	id,
	src,
	alt,
}: {
	id: string;
	src: StaticImageData;
	alt: string;
}) => {
	return (
		<div id={id} className="carousel-item w-full">
			<Image src={src} className="w-full object-contain" alt={alt} />
		</div>
	);
};

// Carousel.tsx
export const Carousel = () => {
	return (
		<div className="carousel w-full h-[50vh] overflow-hidden">
			<CarouselItem id="item1" src={standardMap} alt="Map Choice 1" />
			<CarouselItem id="item2" src={pongOld} alt="Map Choice 2" />
		</div>
	);
};

// CarouselNavigation.tsx
export const CarouselNavigation = () => {
	const dispatch = useDispatch();
	return (
		<div className="flex justify-center w-full py-2 gap-2">
			<a
				href="#item1"
				onClick={() => dispatch(setMapChoice(mapType.STANDARD))}
				className="btn btn-xs"
			>
				1
			</a>
			<a
				href="#item2"
				onClick={() => dispatch(setMapChoice(mapType.CLASSIC))}
				className="btn btn-xs"
			>
				2
			</a>
		</div>
	);
};
