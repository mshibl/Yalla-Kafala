"use client"

import { useState, useEffect, useRef, SetStateAction } from "react";
import Link from "next/link";

// Material UI Components
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Tabs,
  Tab,
  Stack,
  Chip,
  useMediaQuery,
  useTheme,
  alpha,
  Paper,
} from "@mui/material"
import {
  merriweather,
  lora,
  nunitoSans,
  quicksand,
  bebasNeue,
  josefinSans,
  cairo,
  notoSansArabic,
readexPro
} from '@/src/fonts/google';
import { useParams } from "next/navigation";
import Image from "next/image"


// Material UI Icons
import { School, Favorite, LocalHospital, Security, Home, FamilyRestroom } from "@mui/icons-material"

export default function TheSmallHouse() {
    const params = useParams();
  const locale = params.locale;

  const isRTL = locale === 'ar';


  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down("md"))
  const [activeTab, setActiveTab] = useState("about")
  const [scrollY, setScrollY] = useState(0)

  // Animation refs
  const aboutRef = useRef(null)
  const servicesRef = useRef(null)
  const donationsRef = useRef(null)
  const impactRef = useRef(null)

  // References for scrolling
  const aboutSectionRef = useRef<HTMLDivElement>(null)
  const servicesSectionRef = useRef<HTMLDivElement>(null)
  const donationsSectionRef = useRef<HTMLDivElement>(null)
  const impactSectionRef = useRef<HTMLDivElement>(null)

  // Handle scroll for effects
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleTabChange = (_event: any, newValue: 'about' | 'services' | 'donations') => {
    setActiveTab(newValue)

    // Scroll to the appropriate section
    const sectionMap = {
      about: aboutSectionRef,
      services: servicesSectionRef,
      donations: donationsSectionRef,
    }

    const targetRef = sectionMap[newValue]
    if (targetRef && targetRef.current) {
      targetRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <Box sx={{ bgcolor: "background.default", color: "text.primary",overflow: "hidden", }}>


      {/* Hero Section */}
      <Box
        dir={locale === 'en' ? 'ltr' : 'rtl'}
        sx={{
          position: "relative",
          overflow: "hidden",
          bgcolor: "#ffffff",
          color: "text.primary",

        }}
      >
        <Container maxWidth="lg"  sx={{ mb: isMobile ? 30: 35, overflow: 'visible' 
          
        }}>
          <Grid container spacing={9} alignItems="center">
            <Grid item xs={12} md={5}>
              <Box
                sx={{
                  position: "relative",
                  zIndex: 2,
                  textAlign: locale === 'en' ? 'left' : 'right',
                  pt: isMobile ? 15: 0
                }}
              >
                <Chip
                  label={locale === 'en' ? "A Loving Home for Every Child" : "منزل محب لكل طفل"}
                  sx={{
                    bgcolor: alpha(theme.palette.primary.main, 0.1),
                    color: theme.palette.primary.main,
                    mb: 3,
                    fontSize:"1.2rem"
                  }}
                />
                <Typography
                  variant="h1"
                  component="h1"
                  sx={{
                    fontSize: isRTL? (isMobile ? "2.5rem" : "5rem") :{ xs: "2.3rem", md: "3.5rem", lg: "4rem" } ,
                    fontFamily:isRTL? notoSansArabic.style.fontFamily : merriweather.style.fontFamily,
                    fontWeight: isRTL? 900: 700,
                    mb: isMobile ? 7:0,
                    mt: isMobile ? 10:0,
                    lineHeight: 1.2,
                    
                       color: '#000000',
                  }}
                >
                  {locale === 'en' ? "The Small House" : "البيت الصغير"}{" "}
                  <Box component="span" sx={{ color: theme.palette.primary.main }}>
                    {locale === 'en' ? " Albayt Alsagheer" : ""}
                  </Box>
                </Typography>

                <Typography
                  variant="h6"
                  sx={{
                    mb: 3,
                    maxWidth: 600,
                    color: "#212121",
                    fontFamily: quicksand.style.fontFamily,
                    fontWeight: isRTL ? 560 : 550,
                    fontSize: isRTL ? "1.7rem" : "1.2rem",
                   
                  }}
                >
                  {locale === 'en'
                    ? "The Small House provides family-based care and nurturing for orphaned children not eligible for kafala who need a safe place to grow, learn, and thrive in a supportive environment that prepares them for a bright future."
                    : "البيت الصغير يوفر رعاية أسرية ودعمًا للأطفال اليتامى غير المؤهلين للكفالة، ويمنحهم مكانًا آمنًا للنمو والتعلم والازدهار في بيئة داعمة تهيئهم لمستقبل مشرق."}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} md={7}>
              <Box
                sx={{
                  position: 'relative',
                  height: isMobile ? '250px' : '500px' ,
                  width: '100%',
                  overflow: 'hidden',
                  borderRadius: 1,
                  mt: { xs: 40, md: 15 },              
                  ml: { xs: 0, md: locale === 'en' ? 30 : 0 }, 
                  mr: { xs: 0, md: locale === 'en' ? 0 : 28 },
                  display: 'flex',
                  justifyContent: 'center',          
                  alignItems: 'center',             
                  transform: 'scale(1.4)',
                  transition: "transform 0.3s",
                 
              
                
                }}
              >
                <Image
                  src="/images/Rashaandchild.png"
                  alt="The Small House Facility"
                  width={isMobile ? 300 : 550}
                  height={isMobile ? 280 : 350}
                  style={{
                    borderRadius: "8px",
                    objectFit: "cover",
                   
                    }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>



      {/* About Section */}
      <Box ref={aboutSectionRef} sx={{ py: { xs: 60, md: 60 }, bgcolor: theme.palette.primary.main }}>
        <Container maxWidth="lg">
          <Grid container spacing={isMobile ? 0: 8} alignItems="center">
            
              <Box>
                
                <Typography
                  variant="h2"
                  sx={{
                    mt: 10,
                  
                    mb: 15,
                    color: "#ffffff",
                    position: "relative",
                    fontWeight: 550,
                    fontFamily:isRTL? notoSansArabic.style.fontFamily : merriweather.style.fontFamily,
                    pb: 1,
                    "&:after": {
                      content: '""',
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      width: 80,
                      height: 3,
                      bgcolor: theme.palette.primary.main,
                    },
                  }}
                >
                  {locale === 'en' ? "About  ": " عن"}
                  <Box component="span" sx={{ fontColor: theme.palette.primary.main }}>
                    {locale === 'en' ? " The Small House  ": " البيت الصغير"}
                  </Box>
                </Typography>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 6 } }}>
                <Typography variant="body1" sx={{ color:"#ffffff",fontFamily: quicksand.style.fontFamily, fontWeight: isRTL ? 560 : 550,
                    fontSize: isRTL ? "1.7rem" : "1.2rem", lineHeight: isMobile ? 1.4 : 1.5  }}>
                  {locale === 'en' ? " The Small House is a specialized care facility designed to provide orphaned children with a family-like environment that fosters their physical, emotional, and intellectual development.": "البيت الصغير هو منشأة رعاية متخصصة تهدف إلى توفير بيئة شبيهة بالعائلة للأطفال اليتامى، مما يعزز نموهم البدني والعاطفي والفكري."} 
                </Typography>

                <Typography variant="body1" sx={{ color:"#ffffff", fontFamily:  quicksand.style.fontFamily, fontWeight: isRTL ? 560 : 550,
                    fontSize: isRTL ? "1.7rem" : "1.2rem" , lineHeight: isMobile ? 1.4 : 1.5 }}>
                  {locale === 'en' ? "Unlike traditional orphanages, The Small House operates on a model that prioritizes individualized care, emotional bonding, and preparation for future family life through the Kafala system.": "على عكس دار الأيتام التقليدية، يعتمد البيت الصغير نموذجًا يركز على الرعاية الفردية، وتعزيز الروابط العاطفية، والاستعداد للحياة الأسرية المستقبلية من خلال نظام الكفالة."}
                </Typography>
                <Typography variant="body1" sx={{color:"#ffffff", fontFamily:  quicksand.style.fontFamily, fontWeight: isRTL ? 560 : 550,
                    fontSize: isRTL ? "1.7rem" : "1.2rem" , lineHeight: isMobile ? 1.4 : 1.5  }}>
                  {locale === 'en' ? "Our dedicated team of caregivers, educators, and healthcare professionals work together to ensure each child receives the attention and support they need to overcome past traumas and develop into confident, capable young men and women." : "يعمل فريقنا المخصص من مقدمي الرعاية، والمعلمين، والمهنيين الصحيين معًا لضمان حصول كل طفل على الاهتمام والدعم الذي يحتاجونه للتغلب على الصدمات السابقة والتطور ليصبحوا رجالًا ونساءً واثقين وقادرين."}
                  
                </Typography>
                </Box>
                <Stack direction={{ xs: "row", sm: "row" }} spacing={9} sx={{ mt: 10, flexDirection: isRTL?  'row-reverse' : 'row',  gap: isRTL? 6 : 0}}> 
                <Link href={`/${locale}/who_we_are`}>
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    sx={{
                      borderWidth: 2,
                      color: "#ffffff",
                      borderColor: "#ffffff",
                      fontWeight: 600,
                      borderRadius: 50,
                      fontSize: isMobile ? "1.3rem" : "1.6rem",
                      fontFamily: quicksand.style.fontFamily,
                      "&:hover": {
                        color: "#ffffff",
                        borderColor: "#ffffff",
                        bgcolor: alpha("#ffffff", 0.1),
                      },
                    }}
                  >
                    {locale === 'en' ? " Read Our Story" : "اقرأ قصتنا"}
                  </Button>
                </Link>
                    <Link href={`/${locale}/what_is_kafala`}>
                    <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    sx={{
                      borderWidth: 2,
                      color: "#ffffff", 
                      borderColor: "#ffffff", 
                      fontWeight: 600,
                      borderRadius: 50,
                      fontSize: isMobile ? "1.3rem" : "1.6rem",
                      fontFamily: quicksand.style.fontFamily,
                      "&:hover": {
                      color: "#ffffff", 
                      borderColor: "#ffffff", 
                      bgcolor: alpha("#ffffff", 0.1), 
                      },
                    }}
                    >
                     {locale === 'en' ? "Learn About Kafala" : "تعرف على الكفالة"}
                    </Button>
                    </Link>
                </Stack>
              </Box>
            </Grid>
        </Container>
      </Box>

      {/* What is Yalla Family House Section */}
      <Box
      dir={locale === 'en' ? 'ltr' : 'rtl'} 
        ref={impactSectionRef}
        sx={{
          py: { xs: 8, md: 12 },
          
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
          mb:15
          
        }}
        
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6} ref={impactRef}>
              <Typography
                variant="h2"
                sx={{
                  mt: 30,
                  mb: 10,
                  position: "relative",
                  pb: 2,
                  color:"#000000",
                  fontFamily:isRTL? notoSansArabic.style.fontFamily : merriweather.style.fontFamily,
                  fontWeight: 700,
                  textAlign: locale === 'en' ? 'left' : 'right', 
                  "&:after": {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    width: 80,
                    height: 3,
                    bgcolor: "#ffffff",
                    
                  },
                }}
              >
                 {locale === 'en' ? "What is Yalla Family House?" : "ما هو بيت عائلة يلا؟"} 
              </Typography>
              <Box sx={{ mb: 25}}>
                <Box sx={{ display: "flex", alignItems: "flex-start", color:"#000000"}}>
                  <Box
                    sx={{
                      minWidth: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: alpha("#ffffff", 0.2),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                      mt: 0.5,
                      color:"#000000"
                    }}
                  >
                    •
                  </Box>
                  <Typography variant="body1" sx={{ color: "#000000", 
                  fontFamily: quicksand.style.fontFamily, 
                  fontWeight: isRTL ? 560 : 550,
                  fontSize: isRTL ? "1.7rem" : "1.2rem",
                  lineHeight: 1.4,
                    }}>
                    {locale === 'en' ? (
                      <>
                        <strong>Children without families</strong> suffer from a lack of stability, emotional support, and security.
                      </>
                    ) : (
                      <>
                        <strong>الأطفال بدون أسر</strong> يعانون من نقص الاستقرار والدعم العاطفي والأمان.
                      </>
                    )}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <Box
                    sx={{
                      minWidth: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: alpha("#ffffff", 0.2),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                      mt: 0.5,
                      color:"#000000"
                    }}
                  >
                    •
                  </Box>
                  <Typography variant="body1" sx={{color:"#000000", 
                  fontFamily:  quicksand.style.fontFamily, 
                  fontWeight: isRTL ? 560 : 550,
                    fontSize: isRTL ? "1.7rem" : "1.2rem",
                    lineHeight: 1.4,}}>
                    {locale === 'en' ? (
                      <>
                        <strong>Orphanages do not replace a home</strong>  - children deserve love, care, and dignity.
                      </>
                    ) : (
                      <>
                        <strong>دور الأيتام لا تعوض المنزل</strong> - الأطفال يستحقون الحب والرعاية والكرامة.
                      </>
                    )}
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                  <Box
                    sx={{
                      minWidth: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: alpha("#ffffff", 0.2),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                      mt: 0.5,
                      color:"#000000"
                    }}
                  >
                    •
                  </Box>
                  <Typography variant="body1" sx={{color:"#000000", fontFamily:  quicksand.style.fontFamily, fontWeight: isRTL ? 560 : 550,
                    fontSize: isRTL ? "1.7rem" : "1.2rem", lineHeight: 1.4}}>
                    {locale === 'en' ? (
                      <>
                        <strong>We are breaking the cycle</strong>  by ensuring girls grow up in a safe, nurturing environment.
                      </>
                    ) : (
                      <>
                        <strong>نحن نكسر الحلقة</strong>  من خلال ضمان أن تنشأ الفتيات في بيئة آمنة ومغذية.
                      </>
                    )}
                    
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "flex-start", mb: 10 }}>
                  <Box
                    sx={{
                      minWidth: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: alpha("#ffffff", 0.2),
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      mr: 2,
                      mt: 0.5,
                      color:"#000000"
                    }}
                  >
                    •
                  </Box>
                  <Typography variant="body1" sx={{color:"#000000", fontFamily: quicksand.style.fontFamily,fontWeight: isRTL ? 560 : 550,
                    fontSize: isRTL ? "1.7rem" : "1.2rem", lineHeight: 1.5}}>
                    {locale === 'en' ? (
                      <>
                        <strong>At The Small House</strong>, they receive:
                      </>
                    ) : (
                      <>
                        <strong>في البيت الصغير</strong>, يحصلون على:
                      </>
                    )}
                    
                  </Typography>
                </Box>
                <Box sx={{  }}>
                  <Grid container spacing={1}>
                    {[
                      { icon: <School />, text: locale === 'en' ? "Quality education" : "تعليم عالي الجودة" },
                      { icon: <Favorite />, text: locale === 'en' ? "Nutritious food" : "طعام مغذي" },
                      { icon: <LocalHospital />, text: locale === 'en' ? "Proper healthcare" : "رعاية صحية مناسبة" },
                      { icon: <Security />, text: locale === 'en' ? "Privacy & safety" : "الخصوصية والأمان" },
                    ].map((item, index) => (
                      <Grid item xs={6} key={index}>
                      <Box sx={{ display: "flex", alignItems: "center", mb: 8 }}>
                        <Box
                        sx={{
                          minWidth: 32,
                          height: 32,
                          borderRadius: "50%",
                          bgcolor: "#000000",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mr: 10,
                          ml : isRTL ? 5 : 0,
                          color:"#ffffff",
                        }}
                        >
                        {item.icon}
                        </Box>
                        <Typography variant="body2" sx={{
                        color:"#000000", 
                        fontFamily:quicksand.style.fontFamily,
                        
                        fontWeight: isRTL ? 560 : 550,
                    fontSize: isRTL ? "1.7rem" : "1.2rem",
                        }}>
                        {item.text}
                        </Typography>
                      </Box>
                      </Grid>
                    ))}
                  </Grid>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              
            
            <Box
              sx={{
                 position: 'relative',
                  height: isMobile ? '250px' : '430px' ,
                  width: '100%',
                  overflow: 'hidden',
                  borderRadius: 1,
                  mt: { xs: 40, md: 15 },              
                  ml: { xs: 0, md: locale === 'en' ? 25 : 0 }, 
                  mr: { xs: 0, md: locale === 'en' ? 0 : 25 },
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',             
                  transform: 'scale(1.4)',
                  transition: "transform 0.3s",
              }}
            >
              <Image
                src="/images/ThesmallhouseBeds.png"
                alt="The Small House Facility"
                width={isMobile ? 300 : 540}
                  height={isMobile ? 280 : 350}
                  style={{
                  borderRadius: "8px",
                  objectFit: "cover",
                  width: isMobile ?'100%' : '80%',
                  height: '100%',
                  maxWidth: '90%'
                  }}
              />
            </Box>
            
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* What We Provide Section */}
      <Box
        ref={servicesSectionRef}
        sx={{
          py: { xs: 8, md: 12 },
          bgcolor: "#2194BC",
          mt:5,
          
        }}
      >
        <Container maxWidth="lg" sx= {{ mb: 80, mt: 60 }}>
          <Box sx={{ textAlign: "center", alignItems: 'center',mt: 20 }} ref={servicesRef}>
            
            <Typography variant="h2" sx={{  fontFamily:isRTL? notoSansArabic.style.fontFamily : merriweather.style.fontFamily, fontWeight: 700, color: "#ffffff" }}>
              {locale === 'en' ? "What We Provide" : "ماذا نقدم"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 2,lineHeight: 1.4, fontFamily: quicksand.style.fontFamily, fontWeight: 700, fontSize: 29, color: "#ffffff" }}>
              {locale === 'en'
                ? "At The Small House, we ensure each child receives the care and support they need to thrive."
                : "في البيت الصغير، نضمن أن يحصل كل طفل على الرعاية والدعم اللازمين لينمو ويزدهر."}
            </Typography>
          </Box>

          <Grid container spacing={30} sx={{ mt: 1 }}>
            {[
              {
              icon: <School fontSize="large" />,
              title: locale === 'en' ? "Quality Education" : "تعليم عالي الجودة",
              description:
                locale === 'en'
                ? "Access to quality schools and educational resources to help each girl reach her full academic potential."
                : "الوصول إلى مدارس عالية الجودة وموارد تعليمية لمساعدة كل فتاة على تحقيق إمكاناتها الأكاديمية الكاملة.",
              },
              {
              icon: <Favorite fontSize="large" />,
              title: locale === 'en' ? "Nutritious Food" : "طعام مغذي",
              description:
                locale === 'en'
                ? "Balanced, healthy meals prepared with care to support physical growth and overall wellbeing."
                : "وجبات متوازنة وصحية تُعد بعناية لدعم النمو الجسدي والصحة العامة.",
              },
              {
              icon: <LocalHospital fontSize="large" />,
              title: locale === 'en' ? "Proper Healthcare" : "رعاية صحية مناسبة",
              description:
                locale === 'en'
                ? "Regular medical check-ups, preventive care, and immediate attention to health concerns."
                : "فحوصات طبية منتظمة، ورعاية وقائية، واهتمام فوري بأي مشكلات صحية.",
              },
              {
              icon: <Security fontSize="large" />,
              title: locale === 'en' ? "Privacy & Safety" : "الخصوصية والأمان",
              description:
                locale === 'en'
                ? "A secure environment where each girl has personal space and feels protected."
                : "بيئة آمنة حيث تحصل كل فتاة على مساحة شخصية وتشعر بالحماية.",
              },
            ].map((service, index) => (
              <Grid item xs={12} sm={6} md={3} key={index} >
                <Paper
                  elevation={2}
                  sx={{
                    
                    height: "100%",
                    overflow: "hidden",
                    transition: "transform 0.3s",
                    borderRadius: 7,
                    border: 2,
                    borderColor: "#ffffff",
                    "&:hover": {
                      transform: "scale(1.03)",
                      boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    },
                  }}
                >
                  <Box
                    sx={{
                      p: 2,
                      bgcolor: "#2194BC",
                      color: "#ffffff",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: 80,
                      mb:5,
 
                    }}
                  >
                    {service.icon}
                  </Box>
                  <Box sx={{ p: 3, textAlign: "center" , mb:20}}>
                    <Typography variant="h6" sx={{ fontWeight: isRTL ? 600 : 800, fontSize: 25, mb: 10, fontFamily: isRTL ? readexPro.style.fontFamily : quicksand.style.fontFamily,  }}>
                      {service.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: "#000000", fontFamily: quicksand.style.fontFamily, fontWeight: 550 , fontSize: 20}}>
                      {service.description}
                    </Typography>
                  </Box>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Your Donations Section */}
      <Box
        ref={donationsSectionRef}
        sx={{
          py: { xs: 8, md: 50 },
          bgcolor: alpha(theme.palette.grey[100], 0.5),
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", width: '100%' }} ref={donationsRef}>
        <Typography variant="h2" sx={{ mt: 30, fontFamily:isRTL? notoSansArabic.style.fontFamily : merriweather.style.fontFamily, fontWeight: 700 }}>
          {locale === 'en' ? "Your Donations Go To" : "تبرعاتكم تذهب إلى"}
        </Typography>
        <Typography variant="body1" sx={{ mx: "auto",  fontFamily: quicksand.style.fontFamily, fontWeight: 700, fontSize: 25 }}>
          {locale === 'en'
            ? "The Small House (Yalla Family House) provides essential care for children who need it most."
            : "البيت الصغير يوفر الرعاية الأساسية للأطفال الأكثر حاجة."}
        </Typography>
          </Box>

          <Grid container spacing={6} sx={{ mb: 10, mt: 20 }}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: isRTL ?25:12, height: "100%", borderRadius: 5, borderColor: "#ffffff", border: 2 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 800, fontSize: 35, fontFamily: quicksand.style.fontFamily }}>
          {locale === 'en' ? "Providing a Safe Home" : "توفير منزل آمن"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, fontFamily: quicksand.style.fontFamily, fontWeight: 600, fontSize: 20 }}>
          {locale === 'en'
            ? "For children not eligible for kafala, we create a stable and secure environment where they can grow and develop."
            : "للأطفال غير المؤهلين للكفالة، نوفر بيئة مستقرة وآمنة تمكنهم من النمو والتطور."}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Home sx={{  mr: isRTL ? 0 : 5, ml: isRTL ? 5 : 0  }} />
          <Typography variant="body1" sx={{ fontFamily: quicksand.style.fontFamily, fontWeight: 600, fontSize: 20 }}>
            {locale === 'en'
              ? "A dedicated facility designed to feel like a real home"
              : "منشأة مخصصة مصممة لتشعر وكأنها منزل حقيقي"}
          </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <Security sx={{  mr: isRTL ? 0 : 5, ml: isRTL ? 5 : 0  }} />
          <Typography variant="body1" sx={{ fontFamily: quicksand.style.fontFamily, fontWeight: 600, fontSize: 20 }}>
            {locale === 'en'
              ? "Safe spaces that provide security and stability"
              : "مساحات آمنة توفر الأمان والاستقرار"}
          </Typography>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6} >
          <Paper elevation={3} sx={{ p: isRTL ? 25 : 17, height: "100%", borderRadius: 5, borderColor: "#ffffff", border: 2 }}>
            <Typography variant="h4" sx={{ mb: 3, fontWeight: 800, fontSize: 35, fontFamily: quicksand.style.fontFamily }}>
          {locale === 'en' ? "A Nurturing Environment" : "بيئة حاضنة"}
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, fontFamily: quicksand.style.fontFamily, fontWeight: 600, fontSize: 20 }}>
          {locale === 'en'
            ? "With a caregiver in a family-based setting, children receive the individual attention they need."
            : "مع مقدم رعاية في بيئة أسرية، يحصل الأطفال على الاهتمام الفردي الذي يحتاجونه."}
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
          <FamilyRestroom sx={{  mr: isRTL ? 0 : 5, ml: isRTL ? 5 : 0 }} />
          <Typography variant="body1" sx={{ fontFamily: quicksand.style.fontFamily, fontWeight: 600, fontSize: 20 }}>
            {locale === 'en'
              ? "Dedicated caregivers providing consistent support"
              : "مقدمو رعاية مخصصون يقدمون دعمًا مستمرًا"}
          </Typography>
            </Box>
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Favorite sx={{ mr: isRTL ? 0 : 5, ml: isRTL ? 5 : 0 }} />
              <Typography variant="body1" sx={{ fontFamily: quicksand.style.fontFamily, fontWeight: 600, fontSize: 20 }}>
              {locale === 'en'
                ? "Family-style care that fosters emotional bonds"
                : "رعاية بأسلوب عائلي تعزز الروابط العاطفية"}
              </Typography>
            </Box>
          </Paper>
        </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CTA Banner */}
      <Box
        sx={{
          py: { xs: 8, md: 100 },
          bgcolor: theme.palette.secondary.main,
          color: "#ffffff",
          position: "relative",
          overflow: "hidden",
          textAlign: "center",

        }}
      >
        
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1, pb: isMobile? 30 : 0, }}>
          <Typography variant="h2" sx={{ mt:10, mb: 10, fontFamily:isRTL? notoSansArabic.style.fontFamily : merriweather.style.fontFamily, fontWeight: 700 }}>
            {locale === 'en' ? "Ready to Make a Difference?" : "هل أنت مستعد لصنع الفرق؟"}
          </Typography>
          <Typography variant="h6" sx={{ mx: "auto",  mb: 30,fontFamily: quicksand.style.fontFamily, fontWeight: 700, fontSize: 25 }}>
            {locale === 'en'
              ? "Join us in our mission to provide loving homes and bright futures for orphaned children."
              : "انضم إلينا في مهمتنا لتوفير منازل محبة ومستقبل مشرق للأطفال اليتامى."}
          </Typography>
          
          <Stack direction={{ xs: "column",  sm: isRTL ? "row-reverse" : "row" }} spacing={8} justifyContent="center">
         
            <Button
              variant="contained"
              size="large"
              component={Link}
              href={`/${locale}/donate`} 
              sx={{
              bgcolor: theme.palette.primary.main,
              color: "#ffffff",
              px: 30,
              py: 3,
              fontSize: 25, 
              
              fontFamily: quicksand.style.fontFamily,
              "&:hover": {
                borderColor: "#ffffff",
                bgcolor: alpha("#ffffff", 0.1),
              },
              }}
            >
              {locale === 'en' ? "Donate" : "تبرع"}
            </Button>
            
              
            
          </Stack>
        </Container>
      </Box>
    </Box>
  )
}
