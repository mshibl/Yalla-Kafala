// "use client"

// import Image from "next/image"
// import {
//   Box,
//   Button,
//   Card,
//   CardContent,
//   Container,
//   Grid,
//   Paper,
//   Typography,
//   useTheme,
//   Stack,
//   Chip,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
// } from "@mui/material"
// import {
//   Home,
//   Favorite,
//   School,
//   Restaurant,
//   HealthAndSafety,
//   Shield,
//   AttachMoney,
//   People,
//   FavoriteBorder,
// } from "@mui/icons-material"
// import {
//   merriweather,
//   lora,
//   nunitoSans,
//   quicksand,
//   bebasNeue,
//   josefinSans
// } from '@/src/fonts/google'

// import { alpha } from "@mui/material/styles"

// export default function TheSmallHouse() {
//   const theme = useTheme()

//   return (
//     <Box
//       sx={{ // add a color here for entire background
//         color: "#8e2a6e",
//         position: "relative",
//         overflow: "hidden",
//       }}
//     >
//       {/* Decorative Elements */}
//       <Box
//         sx={{
//           position: "absolute",
//           top: 0,
//           right: 0,
//           width: 300,
//           height: 300,
//           bgcolor: alpha("#ec407a", 0.2),
//           borderRadius: "50%",
//           transform: "translate(50%, -50%)",
//           filter: "blur(60px)",
//         }}
//       />
//       <Box
//         sx={{
//           position: "absolute",
//           top: 400,
//           left: 0,
//           width: 400,
//           height: 400,
//           bgcolor: alpha("#ce93d8", 0.1),
//           borderRadius: "50%",
//           transform: "translate(-50%, 0)",
//           filter: "blur(60px)",
//         }}
//       />

//       {/* Hero Section */}
//       <Container maxWidth="lg" sx={{ pt: 12, pb: 10, position: "relative" }}>
//         <Box sx={{ position: "relative" }}>
//           <Box
//             sx={{
//               position: "absolute",
//               top: 40,
//               left: 40,
//               width: 80,
//               height: 80,
//               bgcolor: "#8e2a6e",
//               borderRadius: "50%",
//               filter: "blur(30px)",
//             }}
//           />
//           <Box
//             sx={{
//               position: "absolute",
//               bottom: 40,
//               right: 40,
//               width: 120,
//               height: 120,
//               bgcolor: alpha("#ab47bc", 0.2),
//               borderRadius: "50%",
//               filter: "blur(30px)",
//             }}
//           />

//           <Grid container spacing={12} alignItems="center">
//             <Grid item xs={12} md={7}>
//               <Chip
//                 label="The Small House • Al Bayt Al Sagheer"
//                 sx={{
//                   bgcolor: "#8e2a6e",
//                   backdropFilter: "blur(4px)",
//                   color: "#ffffff",
//                   mb: 3,
//                   fontWeight: 500,
//                 }}
//               />
//               <Typography
//                 variant="h1"
//                 sx={{
//                   fontFamily:josefinSans.style.fontFamily,
//                   mb: 3,
//                   fontWeight: 700,
//                   lineHeight: 1.1,
//                 }}
//               >
//                 A Loving Home for{" "}
//                 <Box component="span" sx={{ color: "#f8bbd0" }}>
//                   Every Child
//                 </Box>
//               </Typography>

//               <Typography variant="h6" sx={{ mb: 4, color: alpha("#ffffff", 0.9), maxWidth: 600, fontFamily:josefinSans.style.fontFamily }}>
//                 The Small House provides family-based care and nurturing for orphaned girls who need a safe place to
//                 grow, learn, and thrive.
//               </Typography>

//               <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                 <Button
//                   variant="outlined"
//                   size="large"
//                   sx={{
//                     borderColor: "#ffffff",
//                     color: "#ffffff",
//                     borderWidth: 2,
//                     "&:hover": {
//                       bgcolor: "#ffffff",
//                       color: theme.palette.primary.main,
//                       borderColor: "#ffffff",
//                       borderWidth: 2,
//                       borderRadius: "1000000000px",
//                     },
//                   }}
//                 >
//                   Learn More
//                 </Button>

//                 <Button
//                   variant="contained"
//                   size="large"
//                   sx={{
//                     bgcolor: "#ffffff",
//                     color: theme.palette.primary.main,
//                     "&:hover": {
//                       bgcolor: alpha("#ffffff", 0.9),
//                       borderRadius: "1000000000px",

//                     },
//                   }}
//                 >
//                   Donate Now
//                 </Button>
//               </Stack>
//             </Grid>

//             <Grid item xs={12} md={5}>
//               <Box sx={{ position: "relative" }}>
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: -24,
//                     right: -24,
//                     width: 120,
//                     height: 120,
//                     bgcolor: alpha("#f8bbd0", 0.2),
//                     borderRadius: "50%",
//                     filter: "blur(30px)",
//                   }}
//                 />
//                 <Paper
//                   elevation={12}
//                   sx={{
//                     borderRadius: 4,
//                     overflow: "hidden",
//                     height: 400,
//                     position: "relative",
//                     transform: "perspective(1000px) rotateY(-5deg)",
//                     transition: "transform 0.5s",
//                     "&:hover": {
//                       transform: "perspective(1000px) rotateY(0deg)",
//                     },
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       position: "absolute",
//                       inset: 0,
//                       background: `linear-gradient(to top, ${alpha(theme.palette.primary.main, 0.7)}, rgba(0, 0, 0, 0))`,
//                       zIndex: 1,
//                     }}
//                   />
//                   <Image
//                     src="/images/small-house-children-blocks.png"
//                     alt="Children at The Small House playing with blocks"
//                     fill
//                     style={{ objectFit: "cover" }}
//                   />
//                 </Paper>
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     bottom: -16,
//                     left: -16,
//                     width: 120,
//                     height: 120,
//                     bgcolor: alpha("#f8bbd0", 0.2),
//                     borderRadius: "50%",
//                     filter: "blur(30px)",
//                   }}
//                 />
//               </Box>
//             </Grid>
//           </Grid>
//         </Box>
//       </Container>

//       {/* Stats Section */}
//       <Box
//         sx={{
//           bgcolor: alpha("#ffffff", 0.1),
//           backdropFilter: "blur(4px)",
//           py: 14,// padding above and below the stat thing
//           my: 30,//space between it and hero section
//           borderTop: `1px solid ${alpha("#ffffff", 0.1)}`, // straight line on border
//           borderBottom: `1px solid ${alpha("#ffffff", 0.1)}`, // straight line on border
//         }}
//       >
//         <Container maxWidth="lg">
//           <Grid container spacing={90}>
//             <Grid item xs={6} md={3}>
//               <Box
//                 sx={{
//                   textAlign: "center",
//                   transition: "transform 0.3s",
//                   "&:hover": { transform: "scale(1.05)" },
//                 }}
//               >
//                 <Typography variant="h3" sx={{ color: "#f8bbd0", mb: 1, fontWeight: 700 }}>
//                   24+
//                 </Typography>
//                 <Typography sx={{ color: alpha("#ffffff", 0.8) }}>Girls Supported</Typography>
//               </Box>
//             </Grid>
//             <Grid item xs={6} md={3}>
//               <Box
//                 sx={{
//                   textAlign: "center",
//                   transition: "transform 0.3s",
//                   "&:hover": { transform: "scale(1.05)" },
//                 }}
//               >
//                 <Typography variant="h3" sx={{ color: "#f8bbd0", mb: 1, fontWeight: 700 }}>
//                   12
//                 </Typography>
//                 <Typography sx={{ color: alpha("#ffffff", 0.8) }}>Dedicated Staff</Typography>
//               </Box>
//             </Grid>
//             <Grid item xs={6} md={3}>
//               <Box
//                 sx={{
//                   textAlign: "center",
//                   transition: "transform 0.3s",
//                   "&:hover": { transform: "scale(1.05)" },
//                 }}
//               >
//                 <Typography variant="h3" sx={{ color: "#f8bbd0", mb: 1, fontWeight: 700 }}>
//                   8+
//                 </Typography>
//                 <Typography sx={{ color: alpha("#ffffff", 0.8) }}>Years Experience</Typography>
//               </Box>
//             </Grid>
//             <Grid item xs={6} md={3}>
//               <Box
//                 sx={{
//                   textAlign: "center",
//                   transition: "transform 0.3s",
//                   "&:hover": { transform: "scale(1.05)" },
//                 }}
//               >
//                 <Typography variant="h3" sx={{ color: "#f8bbd0", mb: 1, fontWeight: 700 }}>
//                   18
//                 </Typography>
//                 <Typography sx={{ color: alpha("#ffffff", 0.8) }}>Successful Kafalas</Typography>
//               </Box>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>

//       {/* Image Gallery */}
//       <Container maxWidth="lg" sx={{ py: 10 }}>
//         <Grid container spacing={3}>
//           <Grid item xs={12} md={5} lg={4}>
//             <Paper
//               elevation={8}
//               sx={{
//                 borderRadius: 4,
//                 overflow: "hidden",
//                 height: 320,
//                 position: "relative",
//                 transition: "transform 0.5s",
//                 "&:hover": {
//                   transform: "scale(1.02)",
//                 },
//               }}
//             >
//               <Box
//                 sx={{
//                   position: "absolute",
//                   inset: 0,
//                   background: `linear-gradient(to top, ${alpha(theme.palette.primary.main, 0.7)}, rgba(0, 0, 0, 0))`,
//                   zIndex: 1,
//                 }}
//               />
//               <Image
//                 src="/images/small-house-caregiver.png"
//                 alt="Caregiver with child at The Small House"
//                 fill
//                 style={{ objectFit: "cover" }}
//               />
//               <Box sx={{ position: "absolute", bottom: 16, left: 16, zIndex: 2 }}>
//                 <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 500 }}>
//                   Nurturing Care
//                 </Typography>
//               </Box>
//             </Paper>
//           </Grid>
//           <Grid item xs={12} md={7} lg={8}>
//             <Paper
//               elevation={8}
//               sx={{
//                 borderRadius: 4,
//                 overflow: "hidden",
//                 height: 320,
//                 position: "relative",
//                 transition: "transform 0.5s",
//                 "&:hover": {
//                   transform: "scale(1.02)",
//                 },
//               }}
//             >
//               <Box
//                 sx={{
//                   position: "absolute",
//                   inset: 0,
//                   background: `linear-gradient(to top, ${alpha(theme.palette.primary.main, 0.7)}, rgba(0, 0, 0, 0))`,
//                   zIndex: 1,
//                 }}
//               />
//               <Image
//                 src="/images/small-house-children-playing.png"
//                 alt="Children playing at The Small House"
//                 fill
//                 style={{ objectFit: "cover" }}
//               />
//               <Box sx={{ position: "absolute", bottom: 16, left: 16, zIndex: 2 }}>
//                 <Typography variant="h6" sx={{ color: "#ffffff", fontWeight: 500 }}>
//                   Learning Through Play
//                 </Typography>
//               </Box>
//             </Paper>
//           </Grid>
//         </Grid>
//       </Container>

//       {/* Alternative Care Solution Section */}
//       <Box
//         sx={{
//           position: "relative",
//           py: 12,
//           overflow: "hidden",
//           background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
//         }}
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: -160,
//             right: -160,
//             width: 320,
//             height: 320,
//             bgcolor: alpha(theme.palette.secondary.main, 0.1),
//             borderRadius: "50%",
//             filter: "blur(60px)",
//           }}
//         />
//         <Box
//           sx={{
//             position: "absolute",
//             bottom: -160,
//             left: -160,
//             width: 320,
//             height: 320,
//             bgcolor: alpha("#ec407a", 0.1),
//             borderRadius: "50%",
//             filter: "blur(60px)",
//           }}
//         />

//         <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
//           <Grid container spacing={6} alignItems="center">
//             <Grid item xs={12} md={6}>
//               <Chip
//                 label="Alternative Care Solution"
//                 sx={{
//                   bgcolor: alpha("#ffffff", 0.2),
//                   backdropFilter: "blur(4px)",
//                   color: "#ffffff",
//                   mb: 3,
//                   fontWeight: 500,
//                 }}
//               />
//               <Typography variant="h2" sx={{ fontFamily: nunitoSans.style.fontFamily, mb: 4 }}>
//                 Al Bayt Al Sagheer
//               </Typography>

//               <Stack spacing={5}>
//                 <Paper
//                   elevation={0}
//                   sx={{
//                     bgcolor: alpha("#ffffff", 0.1),
//                     backdropFilter: "blur(4px)",
//                     p: 20,
//                     borderRadius: 5,
//                     transition: "transform 0.3s",
//                     "&:hover": { transform: "scale(1.02)" },
//                   }}
//                 >
//                   <Stack direction="row" spacing={2}>
//                     <Box
//                       sx={{
//                         width: 48,
//                         height: 48,
//                         bgcolor: "#ffffff",
//                         borderRadius: "50%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         boxShadow: 3,
//                         flexShrink: 0,
//                       }}
//                     >
//                       <Home sx={{ color: theme.palette.primary.main }} />
//                     </Box>
//                     <Box>
//                       <Typography variant="h6" sx={{ mb: 1 }}>
//                         Providing a safe home
//                       </Typography>
//                       <Typography sx={{ color: alpha("#ffffff", 0.8) }}>
//                         For children not eligible for kafala, we create a secure and loving environment where they can
//                         thrive.
//                       </Typography>
//                     </Box>
//                   </Stack>
//                 </Paper>

//                 <Paper
//                   elevation={0}
//                   sx={{
//                     bgcolor: alpha("#ffffff", 0.1),
//                     backdropFilter: "blur(4px)",
//                     p: 20,
//                     borderRadius: 5,
//                     transition: "transform 0.3s",
//                     "&:hover": { transform: "scale(1.02)" },
//                   }}
//                 >
//                   <Stack direction="row" spacing={2}>
//                     <Box
//                       sx={{
//                         width: 48,
//                         height: 48,
//                         bgcolor: "#ffffff",
//                         borderRadius: "50%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         boxShadow: 3,
//                         flexShrink: 0,
//                       }}
//                     >
//                       <Favorite sx={{ color: theme.palette.primary.main }} />
//                     </Box>
//                     <Box>
//                       <Typography variant="h6" sx={{ mb: 1 }}>
//                         A nurturing environment
//                       </Typography>
//                       <Typography sx={{ color: alpha("#ffffff", 0.8) }}>
//                         With a foster mother and a family-based setting, we ensure each child receives the individual
//                         attention and care they need.
//                       </Typography>
//                     </Box>
//                   </Stack>
//                 </Paper>
//               </Stack>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Box sx={{ position: "relative" }}>
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: -24,
//                     left: -24,
//                     width: 120,
//                     height: 120,
//                     bgcolor: alpha(theme.palette.secondary.main, 0.2),
//                     borderRadius: "50%",
//                     filter: "blur(30px)",
//                   }}
//                 />
//                 <Paper
//                   elevation={16}
//                   sx={{
//                     borderRadius: 4,
//                     background: `linear-gradient(to bottom right, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
//                     p: 27.5,
//                     transition: "transform 0.5s",
//                     "&:hover": {
//                       transform: "scale(1.02)",
//                     },
//                   }}
//                 >
//                   <Typography variant="h3" sx={{ color: "#ffffff", mb: 4, fontWeight: 700, fontFamily: nunitoSans.style.fontFamily }}>
//                     Your Donations Goes To
//                   </Typography>
//                   <List>
//                     {[
//                       "Providing quality education and learning materials",
//                       "Nutritious meals and healthcare services",
//                       "Comfortable living spaces and recreational activities",
//                       "Supporting our dedicated caregivers and staff",
//                     ].map((item, index) => (
//                       <ListItem key={index} sx={{ py: 1 }}>
//                         <ListItemIcon sx={{ minWidth: 36 }}>
//                           <Typography variant="h5" sx={{ color: "#ffffff" }}>
//                             •
//                           </Typography>
//                         </ListItemIcon>
//                         <ListItemText primary={item} sx={{ color: "#ffffff" }} />
//                       </ListItem>
//                     ))}
//                   </List>
//                   <Box sx={{ mt: 4 }}>
//                     <Button
//                       variant="contained"
//                       size="large"
//                       sx={{
//                         bgcolor: "#ffffff",
//                         color: theme.palette.secondary.main,
//                         "&:hover": {
//                           bgcolor: theme.palette.grey[900],
//                           color: "#ffffff",
//                         },
//                       }}
//                     >
//                       Donate Now
//                     </Button>
//                   </Box>
//                 </Paper>
//               </Box>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>

//       {/* About Section */}
//       <Container maxWidth="lg" sx={{ py: 12, position: "relative" }}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             right: 0,
//             width: 250,
//             height: 250,
//             bgcolor: alpha("#f8bbd0", 0.1),
//             borderRadius: "50%",
//             transform: "translate(50%, -50%)",
//             filter: "blur(60px)",
//           }}
//         />

//         <Grid container spacing={8} alignItems="center">
//           <Grid item xs={12} md={6} order={{ xs: 2, md: 1 }}>
//             <Box sx={{ position: "relative" }}>
//               <Box
//                 sx={{
//                   position: "absolute",
//                   top: -24,
//                   left: -24,
//                   width: 120,
//                   height: 120,
//                   bgcolor: alpha("#ec407a", 0.2),
//                   borderRadius: "50%",
//                   filter: "blur(30px)",
//                 }}
//               />
//               <Paper
//                 elevation={12}
//                 sx={{
//                   borderRadius: 4,
//                   overflow: "hidden",
//                   height: 400,
//                   position: "relative",
//                   transition: "transform 0.5s",
//                   "&:hover": {
//                     transform: "scale(1.02)",
//                   },
//                 }}
//               >
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     inset: 0,
//                     background: `linear-gradient(to top, ${alpha(theme.palette.primary.main, 0.7)}, rgba(0, 0, 0, 0))`,
//                     zIndex: 1,
//                   }}
//                 />
//                 <Image
//                   src="/images/small-house-bedroom.png"
//                   alt="Children's bedroom at The Small House"
//                   fill
//                   style={{ objectFit: "cover" }}
//                 />
//               </Paper>
//             </Box>
//           </Grid>

//           <Grid item xs={12} md={6} order={{ xs: 1, md: 2 }}>
//             <Chip
//               label="Our Mission"
//               sx={{
//                 bgcolor: alpha("#ffffff", 0.2),
//                 backdropFilter: "blur(4px)",
//                 color: "#ffffff",
//                 mb: 3,
//                 fontWeight: 500,
//               }}
//             />
//             <Typography variant="h2" sx={{ fontFamily: "serif", mb: 1, position: "relative" }}>
//               About{" "}
//               <Box component="span" sx={{ color: "#f8bbd0" }}>
//                 The Small House
//               </Box>
//             </Typography>
//             <Box sx={{ width: 80, height: 4, bgcolor: "#f8bbd0", mb: 4 }} />

//             <Typography sx={{ mb: 3, color: alpha("#ffffff", 0.9) }}>
//               The Small House is a specialized care facility designed to provide orphaned girls with a family-like
//               environment that fosters their physical, emotional, and intellectual development.
//             </Typography>
//             <Typography sx={{ mb: 3, color: alpha("#ffffff", 0.9) }}>
//               Unlike traditional orphanages, The Small House operates on a model that prioritizes individualized care,
//               emotional bonding, and preparation for future family life through the Kafala system.
//             </Typography>
//             <Typography sx={{ color: alpha("#ffffff", 0.9) }}>
//               Our dedicated team of caregivers, educators, and healthcare professionals work together to ensure each
//               child receives the attention and support they need to overcome past traumas and develop into confident,
//               capable young women.
//             </Typography>
//           </Grid>
//         </Grid>
//       </Container>

//       {/* What We Provide */}
//       <Box sx={{ bgcolor: "#ffffff", py: 12, position: "relative" }}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: 80,
//             background: `linear-gradient(to bottom, ${theme.palette.primary.main}, rgba(0, 0, 0, 0))`,
//           }}
//         />

//         <Container maxWidth="lg">
//           <Box sx={{ textAlign: "center", mb: 8 }}>
//             <Chip
//               label="Our Services"
//               sx={{
//                 bgcolor: alpha(theme.palette.primary.main, 0.1),
//                 color: theme.palette.primary.main,
//                 mb: 2,
//                 fontWeight: 500,
//               }}
//             />
//             <Typography variant="h2" sx={{ fontFamily: "serif", mb: 2, color: theme.palette.text.primary }}>
//               What We Provide
//             </Typography>
//             <Typography sx={{ color: theme.palette.text.secondary, maxWidth: 700, mx: "auto" }}>
//               At The Small House, we provide comprehensive care to ensure each girl's physical, emotional, and
//               intellectual needs are met.
//             </Typography>
//           </Box>

//           <Grid container spacing={4}>
//             {[
//               {
//                 icon: <School />,
//                 title: "Quality Education",
//                 description:
//                   "Access to quality schools, tutoring, and educational resources to help each girl reach her full academic potential.",
//               },
//               {
//                 icon: <Restaurant />,
//                 title: "Nutritious Food",
//                 description:
//                   "Balanced, healthy meals prepared with care to support physical growth and overall wellbeing.",
//               },
//               {
//                 icon: <HealthAndSafety />,
//                 title: "Proper Healthcare",
//                 description: "Regular medical check-ups, preventive care, and immediate attention to health concerns.",
//               },
//               {
//                 icon: <Shield />,
//                 title: "Privacy & Safety",
//                 description: "A secure environment where each girl has personal space and feels protected.",
//               },
//             ].map((service, index) => (
//               <Grid item xs={12} sm={6} md={3} key={index}>
//                 <Paper
//                   elevation={8}
//                   sx={{
//                     borderRadius: 4,
//                     background: `linear-gradient(to bottom right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
//                     p: 3,
//                     height: "100%",
//                     transition: "transform 0.3s",
//                     "&:hover": {
//                       transform: "scale(1.05)",
//                     },
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       width: 64,
//                       height: 64,
//                       bgcolor: "#ffffff",
//                       borderRadius: "50%",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       boxShadow: 2,
//                       mb: 2,
//                     }}
//                   >
//                     <Box sx={{ color: theme.palette.primary.main }}>{service.icon}</Box>
//                   </Box>
//                   <Typography variant="h5" sx={{ color: "#ffffff", mb: 2, fontWeight: 600 }}>
//                     {service.title}
//                   </Typography>
//                   <Typography sx={{ color: alpha("#ffffff", 0.9) }}>{service.description}</Typography>
//                 </Paper>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

//       {/* Daily Life */}
//       <Container maxWidth="lg" sx={{ py: 12, position: "relative" }}>
//         <Box
//           sx={{
//             position: "absolute",
//             bottom: 0,
//             right: 0,
//             width: 400,
//             height: 400,
//             bgcolor: alpha("#f8bbd0", 0.1),
//             borderRadius: "50%",
//             transform: "translate(30%, 30%)",
//             filter: "blur(60px)",
//           }}
//         />

//         <Grid container spacing={8} alignItems="center">
//           <Grid item xs={12} md={6}>
//             <Chip
//               label="Daily Schedule"
//               sx={{
//                 bgcolor: alpha("#ffffff", 0.2),
//                 backdropFilter: "blur(4px)",
//                 color: "#ffffff",
//                 mb: 3,
//                 fontWeight: 500,
//               }}
//             />
//             <Typography variant="h2" sx={{ fontFamily: "serif", mb: 1, position: "relative" }}>
//               Daily Life at{" "}
//               <Box component="span" sx={{ color: "#f8bbd0" }}>
//                 The Small House
//               </Box>
//             </Typography>
//             <Box sx={{ width: 80, height: 4, bgcolor: "#f8bbd0", mb: 4 }} />

//             <Typography variant="h5" sx={{ mb: 2 }}>
//               A Structured, Nurturing Routine
//             </Typography>
//             <Typography sx={{ mb: 3, color: alpha("#ffffff", 0.9) }}>
//               At The Small House, we maintain a consistent daily schedule that provides stability while allowing for
//               individual growth and development:
//             </Typography>

//             <Grid container spacing={2} sx={{ mb: 3 }}>
//               {[
//                 "Morning routines that teach self-care and responsibility",
//                 "Educational activities and school attendance",
//                 "Recreational time for play and creative expression",
//                 "Shared meals that foster community and social skills",
//                 "Evening activities that promote emotional bonding",
//                 "Bedtime routines that ensure proper rest",
//               ].map((item, index) => (
//                 <Grid item xs={12} sm={6} key={index}>
//                   <Paper
//                     elevation={0}
//                     sx={{
//                       bgcolor: alpha("#ffffff", 0.1),
//                       backdropFilter: "blur(4px)",
//                       p: 2,
//                       borderRadius: 3,
//                       transition: "transform 0.3s",
//                       "&:hover": { transform: "scale(1.02)" },
//                     }}
//                   >
//                     <Stack direction="row" spacing={1}>
//                       <Typography sx={{ color: "#f8bbd0", fontSize: "1.25rem" }}>•</Typography>
//                       <Typography sx={{ color: "#ffffff" }}>{item}</Typography>
//                     </Stack>
//                   </Paper>
//                 </Grid>
//               ))}
//             </Grid>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Box sx={{ position: "relative" }}>
//               <Box
//                 sx={{
//                   position: "absolute",
//                   bottom: -24,
//                   right: -24,
//                   width: 120,
//                   height: 120,
//                   bgcolor: alpha("#ec407a", 0.2),
//                   borderRadius: "50%",
//                   filter: "blur(30px)",
//                 }}
//               />
//               <Paper
//                 elevation={12}
//                 sx={{
//                   borderRadius: 4,
//                   overflow: "hidden",
//                   height: 400,
//                   position: "relative",
//                   transition: "transform 0.5s",
//                   "&:hover": {
//                     transform: "scale(1.02)",
//                   },
//                 }}
//               >
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     inset: 0,
//                     background: `linear-gradient(to top, ${alpha(theme.palette.primary.main, 0.7)}, rgba(0, 0, 0, 0))`,
//                     zIndex: 1,
//                   }}
//                 />
//                 <Image
//                   src="/images/small-house-caregiver.png"
//                   alt="Caregiver with child at The Small House"
//                   fill
//                   style={{ objectFit: "cover" }}
//                 />
//               </Paper>
//             </Box>
//           </Grid>
//         </Grid>
//       </Container>

//       {/* Success Stories */}
//       <Box sx={{ bgcolor: "#ffffff", py: 12, position: "relative" }}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: 0,
//             left: 0,
//             width: "100%",
//             height: 80,
//             background: `linear-gradient(to bottom, ${theme.palette.primary.main}, rgba(0, 0, 0, 0))`,
//           }}
//         />

//         <Container maxWidth="lg">
//           <Box sx={{ textAlign: "center", mb: 8 }}>
//             <Chip
//               label="Testimonials"
//               sx={{
//                 bgcolor: alpha(theme.palette.primary.main, 0.1),
//                 color: theme.palette.primary.main,
//                 mb: 2,
//                 fontWeight: 500,
//               }}
//             />
//             <Typography variant="h2" sx={{ fontFamily: "serif", mb: 2, color: theme.palette.text.primary }}>
//               Success Stories
//             </Typography>
//             <Typography sx={{ color: theme.palette.text.secondary, maxWidth: 700, mx: "auto" }}>
//               Read about the lives that have been transformed through The Small House and the Kafala system.
//             </Typography>
//           </Box>

//           <Grid container spacing={4}>
//             <Grid item xs={12} md={6}>
//               <Paper
//                 elevation={8}
//                 sx={{
//                   borderRadius: 4,
//                   background: `linear-gradient(to bottom right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
//                   p: 4,
//                   position: "relative",
//                   overflow: "hidden",
//                 }}
//               >
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: 0,
//                     right: 0,
//                     width: 120,
//                     height: 120,
//                     bgcolor: alpha("#f8bbd0", 0.2),
//                     borderRadius: "50%",
//                     transform: "translate(50%, -50%)",
//                     filter: "blur(30px)",
//                   }}
//                 />
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     bottom: -40,
//                     left: -40,
//                     width: 160,
//                     height: 160,
//                     bgcolor: alpha("#ce93d8", 0.2),
//                     borderRadius: "50%",
//                     filter: "blur(30px)",
//                   }}
//                 />

//                 <Box sx={{ position: "relative", zIndex: 1 }}>
//                   <Typography variant="h4" sx={{ color: "#ffffff", mb: 3, fontWeight: 700 }}>
//                     Amira's Journey
//                   </Typography>
//                   <Typography sx={{ mb: 4, color: alpha("#ffffff", 0.9) }}>
//                     When Amira arrived at The Small House at age 4, she was withdrawn and struggled to connect with
//                     others. Through consistent care and support, she blossomed into a confident young girl who excels in
//                     school and was welcomed into a loving Kafala family.
//                   </Typography>
//                   <Paper
//                     elevation={0}
//                     sx={{
//                       bgcolor: alpha("#ffffff", 0.2),
//                       backdropFilter: "blur(4px)",
//                       p: 3,
//                       borderRadius: 3,
//                       transition: "transform 0.3s",
//                       "&:hover": { transform: "scale(1.05)" },
//                     }}
//                   >
//                     <Typography variant="body1" sx={{ fontStyle: "italic", color: "#ffffff" }}>
//                       "The Small House gave me the foundation I needed to believe in myself and trust others again."
//                     </Typography>
//                   </Paper>
//                 </Box>
//               </Paper>
//             </Grid>

//             <Grid item xs={12} md={6}>
//               <Paper
//                 elevation={8}
//                 sx={{
//                   borderRadius: 4,
//                   background: `linear-gradient(to bottom right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
//                   p: 4,
//                   position: "relative",
//                   overflow: "hidden",
//                 }}
//               >
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     top: 0,
//                     right: 0,
//                     width: 120,
//                     height: 120,
//                     bgcolor: alpha("#f8bbd0", 0.2),
//                     borderRadius: "50%",
//                     transform: "translate(50%, -50%)",
//                     filter: "blur(30px)",
//                   }}
//                 />
//                 <Box
//                   sx={{
//                     position: "absolute",
//                     bottom: -40,
//                     left: -40,
//                     width: 160,
//                     height: 160,
//                     bgcolor: alpha("#ce93d8", 0.2),
//                     borderRadius: "50%",
//                     filter: "blur(30px)",
//                   }}
//                 />

//                 <Box sx={{ position: "relative", zIndex: 1 }}>
//                   <Typography variant="h4" sx={{ color: "#ffffff", mb: 3, fontWeight: 700 }}>
//                     Layla's Transformation
//                   </Typography>
//                   <Typography sx={{ mb: 4, color: alpha("#ffffff", 0.9) }}>
//                     Layla spent three years at The Small House, where she discovered her passion for art. The supportive
//                     environment allowed her talents to flourish, and she now lives with her Kafala family who continues
//                     to nurture her creative abilities.
//                   </Typography>
//                   <Paper
//                     elevation={0}
//                     sx={{
//                       bgcolor: alpha("#ffffff", 0.2),
//                       backdropFilter: "blur(4px)",
//                       p: 3,
//                       borderRadius: 3,
//                       transition: "transform 0.3s",
//                       "&:hover": { transform: "scale(1.05)" },
//                     }}
//                   >
//                     <Typography variant="body1" sx={{ fontStyle: "italic", color: "#ffffff" }}>
//                       "I found my voice through art at The Small House, and now I have a family who celebrates my
//                       creativity."
//                     </Typography>
//                   </Paper>
//                 </Box>
//               </Paper>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>

//       {/* How You Can Help */}
//       <Container maxWidth="lg" sx={{ py: 12, position: "relative" }}>
//         <Box
//           sx={{
//             position: "absolute",
//             top: "50%",
//             left: 0,
//             width: 400,
//             height: 400,
//             bgcolor: alpha("#f8bbd0", 0.1),
//             borderRadius: "50%",
//             transform: "translate(-50%, -50%)",
//             filter: "blur(60px)",
//           }}
//         />

//         <Box sx={{ textAlign: "center", mb: 8 }}>
//           <Chip
//             label="Get Involved"
//             sx={{
//               bgcolor: alpha("#ffffff", 0.2),
//               backdropFilter: "blur(4px)",
//               color: "#ffffff",
//               mb: 2,
//               fontWeight: 500,
//             }}
//           />
//           <Typography variant="h2" sx={{ fontFamily: "serif", mb: 2 }}>
//             How You Can Help
//           </Typography>
//           <Typography sx={{ color: alpha("#ffffff", 0.8), maxWidth: 700, mx: "auto" }}>
//             There are many ways you can support our mission to provide loving homes for orphaned girls.
//           </Typography>
//         </Box>

//         <Grid container spacing={4}>
//           {[
//             {
//               icon: <AttachMoney />,
//               title: "Donate",
//               description:
//                 "Your financial contribution helps us provide quality care, education, and resources for the girls.",
//             },
//             {
//               icon: <People />,
//               title: "Volunteer",
//               description:
//                 "Share your time and skills to support our programs and make a difference in the lives of our girls.",
//             },
//             {
//               icon: <FavoriteBorder />,
//               title: "Consider Kafala",
//               description:
//                 "Open your heart and home to a child through the Kafala system and provide them with a permanent family.",
//             },
//           ].map((item, index) => (
//             <Grid item xs={12} md={4} key={index}>
//               <Card
//                 elevation={8}
//                 sx={{
//                   borderRadius: 4,
//                   overflow: "hidden",
//                   transition: "transform 0.3s",
//                   "&:hover": { transform: "scale(1.05)" },
//                 }}
//               >
//                 <Box
//                   sx={{
//                     height: 96,
//                     background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
//                     display: "flex",
//                     alignItems: "center",
//                     justifyContent: "center",
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       width: 64,
//                       height: 64,
//                       bgcolor: "#ffffff",
//                       borderRadius: "50%",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       boxShadow: 3,
//                       transition: "transform 0.3s",
//                       "&:hover": { transform: "scale(1.1)" },
//                     }}
//                   >
//                     <Box sx={{ color: theme.palette.primary.main }}>{item.icon}</Box>
//                   </Box>
//                 </Box>
//                 <CardContent sx={{ p: 3 }}>
//                   <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: theme.palette.text.primary }}>
//                     {item.title}
//                   </Typography>
//                   <Typography sx={{ mb: 3, color: theme.palette.text.secondary }}>{item.description}</Typography>
//                   <Button
//                     variant="contained"
//                     fullWidth
//                     sx={{
//                       bgcolor: theme.palette.primary.main,
//                       "&:hover": {
//                         bgcolor: theme.palette.primary.dark,
//                       },
//                     }}
//                   >
//                     {index === 0 ? "Make a Donation" : index === 1 ? "Become a Volunteer" : "Learn About Kafala"}
//                   </Button>
//                 </CardContent>
//               </Card>
//             </Grid>
//           ))}
//         </Grid>
//       </Container>

//       {/* Call to Action */}
//       <Box
//         sx={{
//           bgcolor: theme.palette.grey[900],
//           color: "#ffffff",
//           py: 10,
//           position: "relative",
//           overflow: "hidden",
//         }}
//       >
//         <Box
//           sx={{
//             position: "absolute",
//             top: -80,
//             right: -80,
//             width: 250,
//             height: 250,
//             bgcolor: alpha("#ec407a", 0.1),
//             borderRadius: "50%",
//             filter: "blur(60px)",
//           }}
//         />
//         <Box
//           sx={{
//             position: "absolute",
//             bottom: -80,
//             left: -80,
//             width: 250,
//             height: 250,
//             bgcolor: alpha("#ce93d8", 0.1),
//             borderRadius: "50%",
//             filter: "blur(60px)",
//           }}
//         />

//         <Container maxWidth="lg" sx={{ textAlign: "center", position: "relative", zIndex: 1 }}>
//           <Typography variant="h2" sx={{ fontFamily: "serif", mb: 3 }}>
//             Make a Difference Today
//           </Typography>
//           <Typography variant="h6" sx={{ mb: 5, maxWidth: 700, mx: "auto", fontWeight: "normal" }}>
//             Your support can transform the life of a child. Join us in our mission to provide loving homes and bright
//             futures.
//           </Typography>
//           <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
//             <Button
//               variant="contained"
//               size="large"
//               sx={{
//                 bgcolor: "#ffffff",
//                 color: theme.palette.grey[900],
//                 px: 4,
//                 py: 1.5,
//                 "&:hover": {
//                   bgcolor: theme.palette.primary.main,
//                   color: "#ffffff",
//                 },
//               }}
//             >
//               Donate Now
//             </Button>
//             <Button
//               variant="outlined"
//               size="large"
//               sx={{
//                 borderColor: "#ffffff",
//                 color: "#ffffff",
//                 borderWidth: 2,
//                 px: 4,
//                 py: 1.5,
//                 "&:hover": {
//                   bgcolor: alpha("#ffffff", 0.1),
//                   borderColor: "#ffffff",
//                   borderWidth: 2,
//                 },
//               }}
//             >
//               Contact Us
//             </Button>
//           </Stack>
//         </Container>
//       </Box>
//     </Box>
//   )
// }

//  "use client"

// import { useState, useRef, RefObject } from "react"
// import Link from "next/link"

// // Material UI Components
// import {
//   Box,
//   Container,
//   Typography,
//   Button,
//   Grid,
//   Paper,
//   Card,
//   CardContent,
//   Tabs,
//   Tab,
//   Stack,
//   Chip,
//   useMediaQuery,
//   useTheme,
//   alpha,
// } from "@mui/material"

// // Material UI Icons
// import {
//   School,
//   Favorite,
//   LocalHospital,
//   Security,
//   Schedule,
//   People,
//   AttachMoney,
//   PersonAdd,
//   ChildCare,
//   Group,
//   CalendarMonth,
//   Handshake,
//   CheckCircle,
// } from "@mui/icons-material"

// import Image from "next/image" // Add Image import
// import { merriweather } from "@/src/fonts/google"

// interface SectionRefs {
//   [key: string]: RefObject<HTMLDivElement>;
// }

// export default function TheSmallHouseSimple() {
//   const theme = useTheme()
//   const isMobile = useMediaQuery(theme.breakpoints.down("md"))
//   const [activeTab, setActiveTab] = useState<string>("about")

//   // Type the refs properly
//   const aboutSectionRef = useRef<HTMLDivElement>(null)
//   const servicesSectionRef = useRef<HTMLDivElement>(null)
//   const dailyLifeSectionRef = useRef<HTMLDivElement>(null)
//   const helpSectionRef = useRef<HTMLDivElement>(null)

//   // Type the event handler
//   const handleTabChange = (_event: React.SyntheticEvent, newValue: string) => {
//     setActiveTab(newValue)

//     const sectionMap: SectionRefs = {
//       about: aboutSectionRef,
//       services: servicesSectionRef,
//       "daily-life": dailyLifeSectionRef,
//       help: helpSectionRef,
//     }

//     const targetRef = sectionMap[newValue]
//     if (targetRef && targetRef.current) {
//       targetRef.current.scrollIntoView({ behavior: "smooth" })
//     }
//   }

//   return (
//     <Box sx={{ bgcolor: "background.default", color: "text.primary" }}>
//       {/* Sticky Navigation */}
//       <Box
//         sx={{
//           position: "sticky",
//           top: 0,
//           zIndex: 1100,
//           bgcolor: alpha(theme.palette.primary.main, 0.9),
//           backdropFilter: "blur(8px)",
//           borderBottom: 1,
//           borderColor: alpha("#ffffff", 0.1),
//         }}
//       >
//         <Container maxWidth="lg">
//           <Tabs
//             value={activeTab}
//             onChange={handleTabChange}
//             variant="scrollable"
//             scrollButtons="auto"
//             allowScrollButtonsMobile
//             centered={!isMobile}
//             sx={{
//               py: 1,
//               "& .MuiTab-root": {
//                 color: "rgba(255, 255, 255, 0.7)",
//                 "&.Mui-selected": {
//                   color: "#ffffff",
//                 },
//               },
//               "& .MuiTabs-indicator": {
//                 backgroundColor: "#ffffff",
//               },
//             }}
//           >
//             <Tab label="About" value="about" />
//             <Tab label="Our Services" value="services" />
//             <Tab label="Daily Life" value="daily-life" />
//             <Tab label="How to Help" value="help" />
//           </Tabs>
//         </Container>
//       </Box>

//       {/* Hero Section */}
//       <Box
//         sx={{
//           position: "relative",
//           overflow: "hidden",
//           bgcolor: "#ffffff",
//           color: "text.primary",
//           pt: { xs: 8, md: 12 },
//           pb: { xs: 8, md: 12 },
//         }}
//       >
//         {/* Decorative Elements */}
//         <Box
//           sx={{
//             position: "absolute",
//             top: 0,
//             right: 0,
//             width: 300,
//             height: 300,
//             bgcolor: alpha(theme.palette.primary.light, 0.3),
//             borderRadius: "50%",
//             transform: "translate(50%, -50%)",
//             filter: "blur(100px)",
//           }}
//         />
//         <Box
//           sx={{
//             position: "absolute",
//             bottom: 0,
//             left: 0,
//             width: 400,
//             height: 400,
//             bgcolor: alpha(theme.palette.secondary.main, 0.2),
//             borderRadius: "50%",
//             transform: "translate(-30%, 30%)",
//             filter: "blur(100px)",
//           }}
//         />

//         <Container maxWidth="lg">
//           <Grid container spacing={6} alignItems="center">
//             <Grid item xs={12} md={6}>
//               <Box sx={{ position: "relative", zIndex: 2 }}>
//                 <Chip
//                   label="The Small House • Al Bayt Al Sagheer"
//                   sx={{
//                     bgcolor: alpha(theme.palette.primary.main, 0.1),
//                     color: theme.palette.primary.main,
//                     mb: 3,
//                   }}
//                 />
//                 <Typography
//                   variant="h1"
//                   component="h1"
//                   sx={{
//                     fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
//                     fontFamily: merriweather.style.fontFamily,
//                     fontWeight: 700,
//                     mb: 3,
//                     lineHeight: 1.2,
//                   }}
//                 >
//                   A Loving Home for{" "}
//                   <Box component="span" sx={{ color: theme.palette.primary.main }}>
//                     Every Child
//                   </Box>
//                 </Typography>

//                 <Typography
//                   variant="h6"
//                   sx={{
//                     mb: 4,
//                     maxWidth: 600,
//                     color: "text.secondary",
//                     fontWeight: 400,
//                   }}
//                 >
//                   The Small House provides family-based care and nurturing for orphaned girls who need a safe place to
//                   grow, learn, and thrive in a supportive environment that prepares them for a bright future.
//                 </Typography>

//                 <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
//                   <Button
//                     variant="outlined"
//                     color="primary"
//                     size="large"
//                     onClick={() => {
//                       setActiveTab("about")
//                       aboutSectionRef.current?.scrollIntoView({ behavior: "smooth" })
//                     }}
//                   >
//                     Learn More
//                   </Button>
//                   <Button variant="contained" color="primary" size="large" component={Link} href="/donate">
//                     Donate Now
//                   </Button>
//                 </Stack>
//               </Box>
//             </Grid>
//             <Grid item xs={12} md={6}>

//                 <Container maxWidth="lg">
//                 <Box
//                 sx={{
//                   display: 'flex',
//                   justifyContent: 'center',
//                   alignItems: 'center',
//                   width: '100%',
//                 }}
//               >
//                 <Box
//                   sx={{
//                     width: '100%',
//                     maxWidth: 600, // Constrain maximum width
//                     textAlign: 'center',
//                     p: 4,
//                   }}
//                 >
//                   <Image
//                     src="/images/Rashaandchild.png"
//                     alt="The Small House Facility"
//                     width={500}
//                     height={400}
//                     style={{
//                       borderRadius: "8px",
//                       objectFit: "cover",
//                       margin: 'auto', // Centers the image
//                     }}
//                   />
//                 </Box>
//               </Box>
//                           </Container>

//                       </Grid>
//                     </Grid>
//                   </Container>
//                 </Box>

//       {/* Stats Section */}
//       <Box
//         sx={{
//           bgcolor: theme.palette.primary.main,
//           color: "#ffffff",
//           py: 5,
//           borderTop: 1,
//           borderBottom: 1,
//           borderColor: alpha("#ffffff", 0.1),
//         }}
//       >
//         <Container maxWidth="lg">
//           <Grid container spacing={4}>
//             {[
//               { number: "24+", label: "Girls Supported", icon: <ChildCare fontSize="large" /> },
//               { number: "12", label: "Dedicated Staff", icon: <Group fontSize="large" /> },
//               { number: "8+", label: "Years Experience", icon: <CalendarMonth fontSize="large" /> },
//               { number: "18", label: "Successful Kafalas", icon: <Handshake fontSize="large" /> },
//             ].map((stat, index) => (
//               <Grid item xs={6} md={3} key={index}>
//                 <Box
//                   sx={{
//                     textAlign: "center",
//                     transition: "transform 0.3s",
//                     "&:hover": { transform: "scale(1.05)" },
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       mb: 2,
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         width: 60,
//                         height: 60,
//                         bgcolor: alpha("#ffffff", 0.2),
//                         borderRadius: "50%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         color: "#ffffff",
//                       }}
//                     >
//                       {stat.icon}
//                     </Box>
//                   </Box>
//                   <Typography
//                     variant="h3"
//                     sx={{
//                       mb: 1,
//                       color: "#ffffff",
//                       fontWeight: 700,
//                     }}
//                   >
//                     {stat.number}
//                   </Typography>
//                   <Typography variant="body1" sx={{ color: alpha("#ffffff", 0.9) }}>
//                     {stat.label}
//                   </Typography>
//                 </Box>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

// {/* About Section */}
// <Box ref={aboutSectionRef} sx={{ py: { xs: 8, md: 12 } }}>
//   <Container maxWidth="lg">
//     <Box
//       sx={{
//         display: 'flex',
//         justifyContent: 'center',
//         alignItems: 'center',
//         width: '100%',
//       }}
//     >
//       <Box
//         sx={{
//           width: '100%',
//           maxWidth: 600, // Constrain maximum width
//           textAlign: 'center',
//           p: 4,
//         }}
//       >
//         <Image
//           src="/images/Kidsplaying.png"
//           alt="The Small House Facility"
//           width={570}
//           height={400}
//           style={{
//             borderRadius: "8px",
//             objectFit: "cover",
//             margin: 'auto', // Centers the image
//           }}
//         />
//       </Box>
//     </Box>
//   </Container>
// </Box>

//       {/* Services Section */}
//       <Box
//         ref={servicesSectionRef}
//         sx={{
//           py: { xs: 8, md: 12 },
//           bgcolor: alpha(theme.palette.grey[100], 0.5),
//         }}
//       >
//         <Container maxWidth="lg">
//           <Box sx={{ textAlign: "center", mb: 6 }}>
//             <Chip
//               label="Our Services"
//               sx={{
//                 bgcolor: alpha(theme.palette.primary.main, 0.1),
//                 color: theme.palette.primary.main,
//                 mb: 2,
//               }}
//             />
//             <Typography variant="h2" sx={{ mb: 2 }}>
//               What We Provide
//             </Typography>
//             <Typography variant="body1" sx={{ maxWidth: 700, mx: "auto", color: "text.secondary", mb: 4 }}>
//               At The Small House, we provide comprehensive care to ensure each girl's physical, emotional, and
//               intellectual needs are met through these key services.
//             </Typography>
//           </Box>

//           <Grid container spacing={3}>
//             {[
//               {
//                 icon: <School fontSize="large" />,
//                 title: "Quality Education",
//                 description:
//                   "Access to quality schools, tutoring, and educational resources to help each girl reach her full academic potential.",
//               },
//               {
//                 icon: <Favorite fontSize="large" />,
//                 title: "Nutritious Food",
//                 description:
//                   "Balanced, healthy meals prepared with care to support physical growth and overall wellbeing.",
//               },
//               {
//                 icon: <LocalHospital fontSize="large" />,
//                 title: "Proper Healthcare",
//                 description: "Regular medical check-ups, preventive care, and immediate attention to health concerns.",
//               },
//               {
//                 icon: <Security fontSize="large" />,
//                 title: "Privacy & Safety",
//                 description: "A secure environment where each girl has personal space and feels protected.",
//               },
//               {
//                 icon: <Schedule fontSize="large" />,
//                 title: "Structured Routine",
//                 description: "Consistent daily schedules that provide stability and teach important life skills.",
//               },
//               {
//                 icon: <People fontSize="large" />,
//                 title: "Social Development",
//                 description: "Opportunities to build relationships and develop essential social and emotional skills.",
//               },
//             ].map((service, index) => (
//               <Grid item xs={12} sm={6} md={4} key={index}>
//                 <Card
//                   sx={{
//                     height: "100%",
//                     overflow: "hidden",
//                     transition: "transform 0.3s",
//                     "&:hover": {
//                       transform: "scale(1.03)",
//                       boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
//                     },
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       height: 160,
//                       bgcolor: theme.palette.primary.main,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       color: "white",
//                     }}
//                   >
//                     {service.icon}
//                   </Box>
//                   <CardContent sx={{ p: 3 }}>
//                     <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
//                       {service.title}
//                     </Typography>
//                     <Typography variant="body2" sx={{ color: "text.secondary" }}>
//                       {service.description}
//                     </Typography>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

//       {/* Daily Life Section */}
//       <Box ref={dailyLifeSectionRef} sx={{ py: { xs: 8, md: 12 } }}>
//         <Container maxWidth="lg">
//           <Grid container spacing={6} alignItems="center">
//             <Grid item xs={12} md={6}>
//               <Box>
//                 <Chip
//                   label="Daily Schedule"
//                   sx={{
//                     bgcolor: alpha(theme.palette.primary.main, 0.1),
//                     color: theme.palette.primary.main,
//                     mb: 2,
//                   }}
//                 />
//                 <Typography
//                   variant="h2"
//                   sx={{
//                     mb: 3,
//                     position: "relative",
//                     pb: 1,
//                     "&:after": {
//                       content: '""',
//                       position: "absolute",
//                       bottom: 0,
//                       left: 0,
//                       width: 80,
//                       height: 3,
//                       bgcolor: theme.palette.primary.main,
//                     },
//                   }}
//                 >
//                   Daily Life at{" "}
//                   <Box component="span" sx={{ color: theme.palette.primary.main }}>
//                     The Small House
//                   </Box>
//                 </Typography>
//                 <Typography variant="h5" sx={{ mb: 2, fontWeight: 500 }}>
//                   A Structured, Nurturing Routine
//                 </Typography>
//                 <Typography variant="body1" sx={{ mb: 3 }}>
//                   At The Small House, we maintain a consistent daily schedule that provides stability while allowing for
//                   individual growth and development:
//                 </Typography>

//                 <Grid container spacing={2} sx={{ mb: 4 }}></Grid>

//                 <Grid container spacing={2} sx={{ mb: 4 }}>
//                   {[
//                     {
//                       text: "Morning routines that teach self-care and responsibility",
//                     },
//                     {
//                       text: "Educational activities and school attendance",
//                     },
//                     {
//                       text: "Recreational time for play and creative expression",
//                     },
//                     {
//                       text: "Shared meals that foster community and social skills",
//                     },
//                     {
//                       text: "Evening activities that promote emotional bonding",
//                     },
//                     {
//                       text: "Bedtime routines that ensure proper rest",
//                     },
//                   ].map((item, index) => (
//                     <Grid item xs={12} sm={6} key={index}>
//                       <Paper
//                         sx={{
//                           p: 3,
//                           borderRadius: 2,
//                           transition: "transform 0.3s",
//                           "&:hover": {
//                             transform: "scale(1.02)",
//                             boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
//                           },
//                           display: "flex",
//                           alignItems: "flex-start",
//                         }}
//                       >
//                         <CheckCircle sx={{ color: theme.palette.primary.main, mr: 1, fontSize: "1.2rem", mt: 0.3 }} />
//                         <Typography variant="body1">{item.text}</Typography>
//                       </Paper>
//                     </Grid>
//                   ))}
//                 </Grid>
//               </Box>
//             </Grid>
//             <Grid item xs={12} md={6}>
//               <Box
//                 sx={{
//                   height: { xs: 300, md: 400 },
//                   borderRadius: 4,
//                   overflow: "hidden",
//                   boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
//                   bgcolor: theme.palette.primary.light,
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   flexDirection: "column",
//                   p: 4,
//                   color: "white",
//                   textAlign: "center",
//                 }}
//               >
//                 <Typography variant="h4" sx={{ mb: 2 }}>
//                   Daily Activities
//                 </Typography>
//                 <Typography variant="body1">
//                   Our daily schedule is designed to provide structure, stability, and opportunities for growth and
//                   development.
//                 </Typography>
//               </Box>
//             </Grid>
//           </Grid>
//         </Container>
//       </Box>

//       {/* How You Can Help Section */}
//       <Box ref={helpSectionRef} sx={{ py: { xs: 8, md: 12 } }}>
//         <Container maxWidth="lg">
//           <Box sx={{ textAlign: "center", mb: 6 }}>
//             <Chip
//               label="Get Involved"
//               sx={{
//                 bgcolor: alpha(theme.palette.primary.main, 0.1),
//                 color: theme.palette.primary.main,
//                 mb: 2,
//               }}
//             />
//             <Typography variant="h2" sx={{ mb: 2 }}>
//               How You Can Help
//             </Typography>
//             <Typography variant="body1" sx={{ maxWidth: 700, mx: "auto", color: "text.secondary", mb: 4 }}>
//               There are many ways you can support our mission to provide loving homes for orphaned girls.
//             </Typography>
//           </Box>

//           <Grid container spacing={4}>
//             {[
//               {
//                 icon: <AttachMoney fontSize="large" />,
//                 title: "Donate",
//                 description:
//                   "Your financial contribution helps us provide quality care, education, and resources for the girls.",
//                 button: "Make a Donation",
//                 link: "/donate",
//               },
//               {
//                 icon: <PersonAdd fontSize="large" />,
//                 title: "Volunteer",
//                 description:
//                   "Share your time and skills to support our programs and make a difference in the lives of our girls.",
//                 button: "Become a Volunteer",
//                 link: "/volunteer",
//               },
//               {
//                 icon: <Favorite fontSize="large" />,
//                 title: "Consider Kafala",
//                 description:
//                   "Open your heart and home to a child through the Kafala system and provide them with a permanent family.",
//                 button: "Learn About Kafala",
//                 link: "/what-is-kafala",
//               },
//             ].map((item, index) => (
//               <Grid item xs={12} sm={6} md={4} key={index}>
//                 <Card
//                   sx={{
//                     height: "100%",
//                     overflow: "hidden",
//                     transition: "transform 0.3s",
//                     "&:hover": {
//                       transform: "scale(1.03)",
//                       boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
//                     },
//                   }}
//                 >
//                   <Box
//                     sx={{
//                       height: 180,
//                       bgcolor: theme.palette.primary.main,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                       color: "white",
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         width: 80,
//                         height: 80,
//                         bgcolor: "rgba(255,255,255,0.2)",
//                         borderRadius: "50%",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       {item.icon}
//                     </Box>
//                   </Box>
//                   <CardContent sx={{ p: 3 }}>
//                     <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
//                       {item.title}
//                     </Typography>
//                     <Typography variant="body2" sx={{ mb: 3, color: "text.secondary", height: 80 }}>
//                       {item.description}
//                     </Typography>
//                     <Button variant="contained" color="primary" fullWidth component={Link} href={item.link}>
//                       {item.button}
//                     </Button>
//                   </CardContent>
//                 </Card>
//               </Grid>
//             ))}
//           </Grid>
//         </Container>
//       </Box>

//       {/* CTA Banner */}
//       <Box
//         sx={{
//           py: { xs: 8, md: 12 },
//           bgcolor: theme.palette.grey[900],
//           color: "#ffffff",
//           position: "relative",
//           overflow: "hidden",
//           textAlign: "center",
//         }}
//       >
//         <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
//           <Typography variant="h2" sx={{ mb: 3 }}>
//             Ready to Make a Difference?
//           </Typography>
//           <Typography variant="h6" sx={{ mb: 6, fontWeight: 400, maxWidth: 700, mx: "auto" }}>
//             Join us in our mission to provide loving homes and bright futures for orphaned girls.
//           </Typography>
//           <Stack direction={{ xs: "column", sm: "row" }} spacing={3} justifyContent="center">
//             <Button
//               variant="contained"
//               size="large"
//               component={Link}
//               href="/apply-for-kafala"
//               sx={{
//                 bgcolor: "#ffffff",
//                 color: theme.palette.grey[900],
//                 px: 4,
//                 py: 1.5,
//                 "&:hover": {
//                   bgcolor: alpha("#ffffff", 0.9),
//                 },
//               }}
//             >
//               Apply for Kafala
//             </Button>
//             <Button
//               variant="outlined"
//               size="large"
//               component={Link}
//               href="/donate"
//               sx={{
//                 borderColor: "#ffffff",
//                 color: "#ffffff",
//                 px: 4,
//                 py: 1.5,
//                 "&:hover": {
//                   borderColor: "#ffffff",
//                   bgcolor: alpha("#ffffff", 0.1),
//                 },
//               }}
//             >
//               Donate Now
//             </Button>
//           </Stack>
//         </Container>
//       </Box>
//     </Box>
//   )
// }

// //start at inserting pics
"use client";

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
} from "@mui/material";
import {
	merriweather,
	lora,
	nunitoSans,
	quicksand,
	bebasNeue,
	josefinSans,
} from "@/src/fonts/google";
import Image from "next/image";

// Material UI Icons
import {
	School,
	Favorite,
	LocalHospital,
	Security,
	Home,
	FamilyRestroom,
} from "@mui/icons-material";

export default function TheSmallHouse({
	params: { locale },
}: { params: { locale: string } }) {
	const theme = useTheme();
	const isMobile = useMediaQuery(theme.breakpoints.down("md"));
	const [activeTab, setActiveTab] = useState("about");
	const [scrollY, setScrollY] = useState(0);
	const isArabic = locale === "ar";

	// Animation refs
	const aboutRef = useRef(null);
	const servicesRef = useRef(null);
	const donationsRef = useRef(null);
	const impactRef = useRef(null);

	// References for scrolling
	const aboutSectionRef = useRef<HTMLDivElement>(null);
	const servicesSectionRef = useRef<HTMLDivElement>(null);
	const donationsSectionRef = useRef<HTMLDivElement>(null);
	const impactSectionRef = useRef<HTMLDivElement>(null);

	// Handle scroll for effects
	useEffect(() => {
		const handleScroll = () => {
			setScrollY(window.scrollY);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const handleTabChange = (
		_event: any,
		newValue: "about" | "services" | "donations",
	) => {
		setActiveTab(newValue);

		// Scroll to the appropriate section
		const sectionMap = {
			about: aboutSectionRef,
			services: servicesSectionRef,
			donations: donationsSectionRef,
		};

		const targetRef = sectionMap[newValue];
		if (targetRef && targetRef.current) {
			targetRef.current.scrollIntoView({ behavior: "smooth" });
		}
	};

	return (
		<Box sx={{ bgcolor: "background.default", color: "text.primary" }}>
			{/* Sticky Navigation */}
			<Box
				sx={{
					position: "sticky",
					top: 0,
					zIndex: 1100,
					bgcolor: alpha(theme.palette.primary.main, 0.9),
					backdropFilter: "blur(8px)",
					borderBottom: 1,
					borderColor: alpha("#ffffff", 0.1),
				}}
			>
				<Container maxWidth="lg">
					<Tabs
						value={activeTab}
						onChange={handleTabChange}
						variant="scrollable"
						scrollButtons="auto"
						allowScrollButtonsMobile
						centered={!isMobile}
						sx={{
							py: 1,
							"& .MuiTab-root": {
								color: "rgba(255, 255, 255, 0.7)",
								"&.Mui-selected": {
									color: "#ffffff",
								},
							},
							"& .MuiTabs-indicator": {
								backgroundColor: "#ffffff",
							},
						}}
					>
						<Tab label="About" value="about" />
						<Tab label="What We Provide" value="services" />
						<Tab label="Your Donations" value="donations" />
					</Tabs>
				</Container>
			</Box>

			{/* Hero Section */}
			<Box
				sx={{
					position: "relative",
					overflow: "hidden",
					bgcolor: "#ffffff",
					color: "text.primary",
					pt: { xs: 8, md: 12 },
					pb: { xs: 8, md: 12 },
					pl: isMobile ? 10 : 0,
					pr: isMobile ? 10 : 0,
					mt: -40,
				}}
			>
				<Container maxWidth="lg">
					<Grid container spacing={6} alignItems="center">
						<Grid item xs={12} md={6}>
							<Box sx={{ position: "relative", zIndex: 2 }}>
								<Chip
									label="The Small House • Al Bayt Al Sagheer"
									sx={{
										bgcolor: alpha(theme.palette.primary.main, 0.1),
										color: theme.palette.primary.main,
										mb: 3,
										fontSize: "1.2rem",
									}}
								/>
								<Typography
									variant="h1"
									component="h1"
									sx={{
										fontSize: { xs: "2.5rem", md: "3.5rem", lg: "4rem" },
										fontFamily: merriweather.style.fontFamily,
										fontWeight: 700,
										mb: 30,
										lineHeight: 1.2,
									}}
								>
									A Loving Home for{" "}
									<Box
										component="span"
										sx={{ color: theme.palette.primary.main }}
									>
										Every Child
									</Box>
								</Typography>

								<Typography
									variant="h6"
									sx={{
										mb: 15,
										maxWidth: 600,
										color: "#212121",
										fontFamily: quicksand.style.fontFamily,
										fontWeight: 550,
									}}
								>
									The Small House provides family-based care and nurturing for
									orphaned children not eligible for kafala who need a safe
									place to grow, learn, and thrive in a supportive environment
									that prepares them for a bright future.
								</Typography>

								<Stack direction={{ xs: "column", sm: "row" }} spacing={9}>
									<Button
										variant="outlined"
										color="primary"
										size="large"
										sx={{
											borderWidth: 2,
											color: theme.palette.primary.main,
											fontWeight: 600,
											borderRadius: 50,
											fontSize: "1.2rem",
										}}
									>
										Learn More
									</Button>
									<Button
										variant="outlined"
										color="primary"
										size="large"
										sx={{
											borderWidth: 2,
											color: theme.palette.primary.main,
											fontWeight: 600,
											borderRadius: 50,
											fontSize: "1.2rem",
										}}
									>
										Donate Now
									</Button>
								</Stack>
							</Box>
						</Grid>

						<Grid item xs={12} md={6}>
							<Box
								sx={{
									position: "relative",
									height: { xs: "300px", md: "500px" }, // Responsive height
									width: "100%",
									overflow: "hidden",
									borderRadius: 1,
									ml: 70,
									transform: "scale(1.4)",
									mt: 120,
								}}
							>
								<Image
									src="/images/Rashaandchild.png"
									alt="The Small House Facility"
									width={500}
									height={300}
									style={{ borderRadius: "8px", objectFit: "cover" }}
								/>
							</Box>
						</Grid>
					</Grid>
				</Container>
			</Box>

			{/* About Section */}
			<Box
				ref={aboutSectionRef}
				sx={{ py: { xs: 60, md: 60 }, bgcolor: theme.palette.primary.main }}
			>
				<Container maxWidth="lg">
					<Grid container spacing={8} alignItems="center">
						<Box>
							<Typography
								variant="h2"
								sx={{
									mt: 30,
									mb: 20,
									color: "#ffffff",
									position: "relative",
									fontWeight: 550,
									fontFamily: merriweather.style.fontFamily,
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
								About{" "}
								<Box
									component="span"
									sx={{ color: theme.palette.primary.main, color: "#000000" }}
								>
									The Small House
								</Box>
							</Typography>
							<Typography
								variant="body1"
								sx={{
									mb: 2,
									color: "#ffffff",
									fontFamily: quicksand.style.fontFamily,
									fontWeight: 500,
								}}
							>
								{locale === "en"
									? `The Small House is a specialized care facility designed to
								provide orphaned children with a family-like environment that
								fosters their physical, emotional, and intellectual development.`
									: `المنزل الصغير هو منشأة خدمات جوهرية تصمم لتقديم بيئة منزلية مشابهة للأطفال الأيتام اللاجئين ذوي الأصول المختلفة، مما يحفز تطورهم الجسدي والعاطفي والفكري.`}
							</Typography>
							<Typography
								variant="body1"
								sx={{
									mb: 2,
									color: "#ffffff",
									fontFamily: quicksand.style.fontFamily,
									fontWeight: 500,
								}}
							>
								Unlike traditional orphanages, The Small House operates on a
								model that prioritizes individualized care, emotional bonding,
								and preparation for future family life through the Kafala
								system.
							</Typography>
							<Typography
								variant="body1"
								sx={{
									mb: 90,
									color: "#ffffff",
									fontFamily: quicksand.style.fontFamily,
									fontWeight: 500,
								}}
							>
								Our dedicated team of caregivers, educators, and healthcare
								professionals work together to ensure each child receives the
								attention and support they need to overcome past traumas and
								develop into confident, capable young women.
							</Typography>

							<Stack
								direction={{ xs: "column", sm: "row" }}
								spacing={9}
								sx={{ mt: 10 }}
							>
								<Link href={`/${locale}/who_we_are`}>
									<Button
										variant="outlined"
										color="primary"
										size="large"
										sx={{
											borderWidth: 2,
											color: "#ffffff", // Change this to white
											borderColor: "#ffffff", // Change border to white
											fontWeight: 600,
											borderRadius: 50,
											fontSize: "1.2rem",
											fontFamily: quicksand.style.fontFamily,
											"&:hover": {
												color: "#ffffff",
												borderColor: "#ffffff",
												bgcolor: alpha("#ffffff", 0.1),
											},
										}}
									>
										Read Our Story
									</Button>
								</Link>
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
										fontSize: "1.2rem",
										fontFamily: quicksand.style.fontFamily,
										"&:hover": {
											color: "#ffffff",
											borderColor: "#ffffff",
											bgcolor: alpha("#ffffff", 0.1),
										},
									}}
								>
									Learn About Kafala
								</Button>
							</Stack>
						</Box>
					</Grid>
				</Container>
			</Box>

			{/* What is Yalla Family House Section */}
			<Box
				ref={impactSectionRef}
				sx={{
					py: { xs: 8, md: 12 },

					color: "#ffffff",
					position: "relative",
					overflow: "hidden",
				}}
			>
				<Container maxWidth="lg">
					<Grid container spacing={6} alignItems="center">
						<Grid item xs={12} md={6} ref={impactRef}>
							<Typography
								variant="h2"
								sx={{
									mt: 30,
									mb: 20,
									position: "relative",
									pb: 2,
									color: "#000000",
									fontFamily: merriweather.style.fontFamily,
									fontWeight: 700,

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
								What is Yalla Family House?
							</Typography>
							<Box sx={{ mb: 25 }}>
								<Box
									sx={{
										display: "flex",
										alignItems: "flex-start",
										mb: 2,
										color: "#000000",
									}}
								>
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
											color: "#000000",
										}}
									>
										•
									</Box>
									<Typography
										variant="body1"
										sx={{
											color: "#000000",
											fontFamily: quicksand.style.fontFamily,
										}}
									>
										<strong>Children without families</strong> suffer from a
										lack of stability, emotional support, and security.
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
											color: "#000000",
										}}
									>
										•
									</Box>
									<Typography
										variant="body1"
										sx={{
											color: "#000000",
											fontFamily: quicksand.style.fontFamily,
										}}
									>
										<strong>Orphanages do not replace a home</strong> - children
										deserve love, care, and dignity.
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
											color: "#000000",
										}}
									>
										•
									</Box>
									<Typography
										variant="body1"
										sx={{
											color: "#000000",
											fontFamily: quicksand.style.fontFamily,
										}}
									>
										<strong>We are breaking the cycle</strong> by ensuring girls
										grow up in a safe, nurturing environment.
									</Typography>
								</Box>
								<Box sx={{ display: "flex", alignItems: "flex-start", mb: 20 }}>
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
											color: "#000000",
										}}
									>
										•
									</Box>
									<Typography
										variant="body1"
										sx={{
											color: "#000000",
											fontFamily: quicksand.style.fontFamily,
										}}
									>
										<strong>At The Small House</strong>, they receive:
									</Typography>
								</Box>
								<Box sx={{ pl: 6 }}>
									<Grid container spacing={2}>
										{[
											{ icon: <School />, text: "Quality education" },
											{ icon: <Favorite />, text: "Nutritious food" },
											{ icon: <LocalHospital />, text: "Proper healthcare" },
											{ icon: <Security />, text: "Privacy & safety" },
										].map((item, index) => (
											<Grid item xs={6} key={index}>
												<Box
													sx={{
														display: "flex",
														alignItems: "center",
														mb: 10,
													}}
												>
													<Box
														sx={{
															minWidth: 32,
															height: 32,
															borderRadius: "50%",
															bgcolor: "#000000",
															display: "flex",
															alignItems: "center",
															justifyContent: "center",
															mr: 5,
															color: "#ffffff",
														}}
													>
														{item.icon}
													</Box>
													<Typography
														variant="body2"
														sx={{
															color: "#000000",
															fontFamily: quicksand.style.fontFamily,
															fontWeight: 700,
														}}
													>
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
									position: "relative",
									height: { xs: "300px", md: "500px" }, // Responsive height
									width: "100%",
									overflow: "hidden",
									borderRadius: 1,
									ml: 70,
									transform: "scale(1.4)",
									mt: 120,
								}}
							>
								<Image
									src="/images/ThesmallhouseBeds.png"
									alt="The Small House Facility"
									width={500}
									height={300}
									style={{ borderRadius: "8px", objectFit: "cover" }}
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
					mt: 5,
				}}
			>
				<Container maxWidth="lg" sx={{ mb: 80, mt: 20 }}>
					<Box
						sx={{ textAlign: "center", mt: 30, mb: 30, alignItems: "center" }}
						ref={servicesRef}
					>
						<Typography
							variant="h2"
							sx={{
								mb: 7,
								mt: 10,
								fontFamily: merriweather.style.fontFamily,
								fontWeight: 700,
								color: "#ffffff",
							}}
						>
							What We Provide
						</Typography>
						<Typography
							variant="body1"
							sx={{
								mb: 2,
								fontFamily: quicksand.style.fontFamily,
								fontWeight: 700,
								fontSize: 25,
								color: "#ffffff",
							}}
						>
							At The Small House, we ensure each child receives the care and
							support they need to thrive.
						</Typography>
					</Box>

					<Grid container spacing={30} sx={{ mt: 30 }}>
						{[
							{
								icon: <School fontSize="large" />,
								title: "Quality Education",
								description:
									"Access to quality schools and educational resources to help each girl reach her full academic potential.",
							},
							{
								icon: <Favorite fontSize="large" />,
								title: "Nutritious Food",
								description:
									"Balanced, healthy meals prepared with care to support physical growth and overall wellbeing.",
							},
							{
								icon: <LocalHospital fontSize="large" />,
								title: "Proper Healthcare",
								description:
									"Regular medical check-ups, preventive care, and immediate attention to health concerns.",
							},
							{
								icon: <Security fontSize="large" />,
								title: "Privacy & Safety",
								description:
									"A secure environment where each girl has personal space and feels protected.",
							},
						].map((service, index) => (
							<Grid item xs={12} sm={6} md={3} key={index}>
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
											mb: 5,
										}}
									>
										{service.icon}
									</Box>
									<Box sx={{ p: 3, textAlign: "center", mb: 20 }}>
										<Typography
											variant="h6"
											sx={{
												fontWeight: 800,
												fontSize: 22,
												mb: 10,
												fontFamily: quicksand.style.fontFamily,
											}}
										>
											{service.title}
										</Typography>
										<Typography
											variant="body2"
											sx={{
												color: "#000000",
												fontFamily: quicksand.style.fontFamily,
												fontWeight: 500,
												fontSize: 16,
											}}
										>
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
					<Box sx={{ textAlign: "center", width: "100%" }} ref={donationsRef}>
						<Typography
							variant="h2"
							sx={{
								mt: 30,
								mb: 10,
								fontFamily: merriweather.style.fontFamily,
								fontWeight: 700,
							}}
						>
							Your Donations Go To
						</Typography>
						<Typography
							variant="body1"
							sx={{
								mx: "auto",
								mb: 70,
								fontFamily: quicksand.style.fontFamily,
								fontWeight: 700,
								fontSize: 25,
							}}
						>
							The Small House (Yalla Family House) provides essential care for
							children who need it most.
						</Typography>
					</Box>

					<Grid container spacing={6} sx={{ mb: 50, mt: 50 }}>
						<Grid item xs={12} md={6}>
							<Paper
								elevation={3}
								sx={{
									p: 12,
									height: "100%",
									borderRadius: 5,
									borderColor: "#ffffff",
									border: 2,
								}}
							>
								<Typography
									variant="h4"
									sx={{
										mb: 3,
										fontWeight: 800,
										fontSize: 35,
										fontFamily: quicksand.style.fontFamily,
									}}
								>
									Providing a Safe Home
								</Typography>
								<Typography
									variant="body1"
									sx={{
										mb: 3,
										fontFamily: quicksand.style.fontFamily,
										fontWeight: 550,
										fontSize: 17,
									}}
								>
									For children not eligible for kafala, we create a stable and
									secure environment where they can grow and develop.
								</Typography>
								<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
									<Home sx={{ mr: 5 }} />
									<Typography
										variant="body1"
										sx={{
											fontFamily: quicksand.style.fontFamily,
											fontWeight: 550,
											fontSize: 20,
										}}
									>
										A dedicated facility designed to feel like a real home
									</Typography>
								</Box>
								<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
									<Security sx={{ mr: 5 }} />
									<Typography
										variant="body1"
										sx={{
											fontFamily: quicksand.style.fontFamily,
											fontWeight: 550,
											fontSize: 20,
										}}
									>
										Safe spaces that provide security and stability
									</Typography>
								</Box>
							</Paper>
						</Grid>
						<Grid item xs={12} md={6}>
							<Paper
								elevation={3}
								sx={{
									p: 12,
									height: "100%",
									borderRadius: 5,
									borderColor: "#ffffff",
									border: 2,
								}}
							>
								<Typography
									variant="h4"
									sx={{
										mb: 3,
										fontWeight: 800,
										fontSize: 30,
										fontFamily: quicksand.style.fontFamily,
									}}
								>
									A Nurturing Environment
								</Typography>
								<Typography
									variant="body1"
									sx={{
										mb: 3,
										fontFamily: quicksand.style.fontFamily,
										fontWeight: 550,
										fontSize: 17,
									}}
								>
									With a caregiver in a family-based setting, children receive
									the individual attention they need.
								</Typography>
								<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
									<FamilyRestroom sx={{ mr: 5 }} />
									<Typography
										variant="body1"
										sx={{
											fontFamily: quicksand.style.fontFamily,
											fontWeight: 550,
											fontSize: 20,
										}}
									>
										Dedicated caregivers providing consistent support
									</Typography>
								</Box>
								<Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
									<Favorite sx={{ mr: 5 }} />
									<Typography
										variant="body1"
										sx={{
											fontFamily: quicksand.style.fontFamily,
											fontWeight: 550,
											fontSize: 20,
										}}
									>
										Family-style care that fosters emotional bonds
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
					mb: 90,
				}}
			>
				<Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
					<Typography
						variant="h2"
						sx={{
							mt: 10,
							mb: 10,
							fontFamily: merriweather.style.fontFamily,
							fontWeight: 700,
						}}
					>
						Ready to Make a Difference?
					</Typography>
					<Typography
						variant="h6"
						sx={{
							mx: "auto",
							mb: 50,
							fontFamily: quicksand.style.fontFamily,
							fontWeight: 700,
							fontSize: 25,
						}}
					>
						Join us in our mission to provide loving homes and bright futures
						for orphaned children.
					</Typography>
					<Stack
						direction={{ xs: "column", sm: "row" }}
						spacing={8}
						justifyContent="center"
					>
						<Button
							variant="contained"
							size="large"
							component={Link}
							href="/apply-for-kafala"
							sx={{
								bgcolor: theme.palette.primary.main,
								borderColor: "#ffffff",
								px: 20,
								py: 3,
								fontSize: 15,
								fontFamily: quicksand.style.fontFamily,
								"&:hover": {
									bgcolor: alpha("#ffffff", 0.9),
								},
							}}
						>
							Apply for Kafala
						</Button>
						<Button
							variant="outlined"
							size="large"
							component={Link}
							href="/donate"
							sx={{
								bgcolor: theme.palette.primary.main,
								fontFamily: quicksand.style.fontFamily,
								color: "#ffffff",
								px: 20,
								py: 3,
								fontSize: 15,
								"&:hover": {
									borderColor: "#ffffff",
									bgcolor: alpha("#ffffff", 0.1),
								},
							}}
						>
							Donate Now
						</Button>
					</Stack>
				</Container>
			</Box>
		</Box>
	);
}
