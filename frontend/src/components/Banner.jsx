
import { bannerStyles } from '../assets/dummyStyles'
import { Star, Stethoscope } from 'lucide-react'

const Banner = () => {
  return (

    <div className={bannerStyles.bannerContainer}>
      <div className={bannerStyles.mainContainer}>
        <div className={bannerStyles.borderOutline}>
            <div className={bannerStyles.outerAnimatedBand}></div>
            <div className={bannerStyles.innerWhiteBorder}></div>   
        </div>

        <div className={bannerStyles.contentContainer}>
            <div className={bannerStyles.flexContainer}>
                <div className={bannerStyles.leftContent}>
                    <div className={bannerStyles.headerBadgeContainer}>
                        <div className={bannerStyles.stethoscopeContainer}>
                            <div className={bannerStyles.stethoscopeInner}>
                                <Stethoscope className={bannerStyles.stethoscopeIcon} />
                            </div>
                        </div>

                        <div className={bannerStyles.titleContainer}>
                            <h1 className={bannerStyles.title}>Medi
                                <span className={bannerStyles.titleGradient}>Care+</span>
                            </h1>

                            {/** stars */}
                            <div className={bannerStyles.starsContainer}>
                               <div className={bannerStyles.starsInner}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star className={bannerStyles.starIcon} key={star} />
                                    ))}
                               </div> 
                            </div>
                        </div>
                    </div>

                    {/** tagline */}
                </div>
            </div>
        </div>
      </div>
    </div>
  )
}

export default Banner
