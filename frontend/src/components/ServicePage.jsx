import { Link } from "react-router-dom";
import { servicePageStyles, serviceCardStyles } from "../assets/dummyStyles"
import { ChevronsRight, MousePointer2Off } from "lucide-react";

const PlaceholderImg = "/placeholder-service.jpg";

const ServiceCard = ({ service }) => {
  const hasSrcSet =
    !!service.imageSrcSet ||
    (!!service.imageSmall && !!service.imageMedium && !!service.imageLarge);

  const src = service.imageUrl || service.image || service.imageSmall || "";
  const srcSet =
    service.imageSrcSet ||
    (service.imageSmall || service.image
      ? `${service.imageSmall || src} 480w, ${
          service.imageMedium || src
        } 768w, ${service.imageLarge || src} 1200w`
      : null);

  const name = service.name || "Service";
  const shortDescription = service.shortDescription || service.about || "";

  return (
    <div className={serviceCardStyles.card}>
      <div className={serviceCardStyles.imageContainer} aria-hidden="true">
        {hasSrcSet ? (
          <picture className={serviceCardStyles.picture}>
            {service.imageWebp && (
              <source srcSet={service.imageWebp} type="image/webp" />
            )}
            {service.imageSrcSet ? (
              <img src={src || PlaceholderImg} srcSet={service.imageSrcSet} alt={name} loading="lazy" decoding="async"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={serviceCardStyles.responsiveImage}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PlaceholderImg;
                }}
              />
            ) : (
              <img src={src || PlaceholderImg} srcSet={srcSet || undefined} alt={name} loading="lazy" decoding="async"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className={serviceCardStyles.responsiveImage}
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = PlaceholderImg;
                }}
              />
            )}
          </picture>
        ) : (
          <img
            src={src || PlaceholderImg}
            alt={name}
            loading="lazy"
            decoding="async"
            className={serviceCardStyles.fallbackImage}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = PlaceholderImg;
            }}
          />
        )}
      </div>

      <div className={serviceCardStyles.content}>
        <h3 className={serviceCardStyles.serviceName}>{name}</h3>

        <div className={serviceCardStyles.buttonContainer}>
          {service.available ? (
            <Link
              to={`/services/${service.id}`}
              state={{ service: service.raw || service }}
              className={serviceCardStyles.buttonAvailable}
              aria-label={`Book ${name}`}
            >
              <ChevronsRight className="w-5 h-5" aria-hidden="true" />
              Book Now
            </Link>
          ) : (
            <button
              disabled
              className={serviceCardStyles.buttonUnavailable}
              aria-label={`${name} not available`}
            >
              <MousePointer2Off className="w-5 h-5" aria-hidden="true" />
              Not Available
            </button>
          )}
        </div>
      </div>
    </div>
  );
};


const ServicePage = () => {
  return (
    <div>
      Service Page
    </div>
  )
}

export default ServicePage
