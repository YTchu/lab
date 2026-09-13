'use strict';
const canvas = document.querySelector('#preview');
const ctx = canvas.getContext('2d');
const packageTextLayer=document.querySelector('#package-text-layer');
packageTextLayer.style.removeProperty('transform');
let weatherSelection='auto';
function selectedWeatherIcon(){
 return weatherSelection==='auto'?automaticWeather.icon:({stormy:'storm',windy:'wind'}[weatherSelection]||weatherSelection);
}
const automaticWeather={icon:'unknown',sunrise:null,sunset:null,expires:0,busy:false,blocked:false};
async function refreshAutomaticWeather(){
 if(automaticWeather.busy||automaticWeather.blocked||Date.now()<automaticWeather.expires)return;
 automaticWeather.busy=true;automaticWeather.icon='unknown';
 try{
  if(!navigator.geolocation)throw new Error('Geolocation unavailable');
  const position=await new Promise((resolve,reject)=>navigator.geolocation.getCurrentPosition(resolve,reject,{enableHighAccuracy:false,timeout:12000,maximumAge:1800000}));
  // Only coarse coordinates are sent to the weather service; no location is saved in HTML.
  const url=new URL('https://api.open-meteo.com/v1/forecast');url.search=new URLSearchParams({latitude:position.coords.latitude.toFixed(2),longitude:position.coords.longitude.toFixed(2),current:'weather_code,wind_speed_10m',daily:'weather_code,sunrise,sunset',timezone:'auto',timeformat:'unixtime',forecast_days:'1'});
  const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),12000);
  let response;try{response=await fetch(url,{signal:controller.signal});}finally{clearTimeout(timer);}
  if(!response.ok)throw new Error('Weather unavailable');const data=await response.json(),daily=data.daily;
  if(!Number.isInteger(daily?.weather_code?.[0])||!Number.isFinite(daily?.sunrise?.[0])||!Number.isFinite(daily?.sunset?.[0]))throw new Error('Invalid weather');
  const code=data.current?.weather_code??daily.weather_code[0];
  automaticWeather.icon=weatherCodeIcon(code);
  // Wind is a scenario only when it is not raining, snowing, or storming (km/h).
  if(['sunny','partly_cloudy','cloudy'].includes(automaticWeather.icon)&&data.current?.wind_speed_10m>=28)automaticWeather.icon='wind';automaticWeather.sunrise=daily.sunrise[0]*1000;automaticWeather.sunset=daily.sunset[0]*1000;
  const midnight=new Date();midnight.setHours(24,0,0,0);automaticWeather.expires=Math.min(Date.now()+1800000,midnight.getTime());
  canvas.title='當日天氣依定位自動取得；天色依當地日出、日落判斷。';
 }catch(error){
  automaticWeather.icon='unknown';automaticWeather.sunrise=null;automaticWeather.sunset=null;automaticWeather.expires=Date.now()+300000;
  automaticWeather.blocked=error.code===1;canvas.title='未取得天氣：請允許瀏覽器定位並確認網路。天色暫依本機 06:00–18:00 判斷。';
 }finally{automaticWeather.busy=false;syncMoodScenario();draw();}
}
function automaticDayIcon(now=new Date()){
 if(Date.now()<automaticWeather.expires&&Number.isFinite(automaticWeather.sunrise)&&Number.isFinite(automaticWeather.sunset))return now.getTime()>=automaticWeather.sunrise&&now.getTime()<automaticWeather.sunset?'sunny':'night';
 return now.getHours()>=6&&now.getHours()<18?'sunny':'night';
}
function weatherCodeIcon(code){
 if(code===0)return 'sunny';if(code===1||code===2)return 'partly_cloudy';if(code===3)return 'cloudy';
 if(code===45||code===48)return 'fog';if([71,73,75,77,85,86].includes(code))return 'snow';
 if([95,96,99].includes(code))return 'storm';if([51,53,55,56,57,61,63,65,66,67,80,81,82].includes(code))return 'rainy';return 'unknown';
}
let sockShadow={color:'rgba(0, 0, 0, 0.22)',blur:12,x:7,y:10};
const palette = ['#D5092D', '#DCE85A', '#132954', '#D4B886', '#008453', '#ECE8DD'];
const defaults = ['#D5092D', '#DCE85A', '#132954', '#D4B886', '#008453', '#D5092D'];
// One 24-unit icon system is shared by the editor and exported artwork.
// Lucide-compatible SVG paths: emoji, weather, and general-purpose icon sets.
const iconPaths={
 angry:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20 M7 8l3 2 M17 8l-3 2 M8 16q4-4 8 0',
 curious:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20 M8 9h.01 M16 9h.01 M14 15a2 2 0 1 1-4 0 2 2 0 0 1 4 0',
 meditate:'M14 5a2 2 0 1 1-4 0 2 2 0 0 1 4 0 M12 9v6 M7 11l5-2 5 2 M7 11l-3 4 M17 11l3 4 M12 15l-7 4q-2 3 3 2l4-2 4 2q5 1 3-2Z',
 exercise:'M6 3 3 6l15 15 3-3Z M3 10l7-7 M14 21l7-7 M2 7l5-5 M17 22l5-5',
 sing:'M17 3a4 4 0 0 1 0 6l-5 5-6-6 5-5a4 4 0 0 1 6 0 M6 8l-3 9 4 4 9-3 M3 21l-1 1',
 coffee:'M18 8h2a2 2 0 0 1 0 4h-2 M3 8h15v9a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3Z M6 2v2 M10 2v2 M14 2v2',
 snack:'M12 3a9 9 0 1 0 9 9 4 4 0 0 1-4-4 4 4 0 0 1-5-5Z M7 9h.01 M8 15h.01 M13 17h.01 M13 11h.01',
 read:'M12 6v15 M12 6Q7 2 2 4v15q5-2 10 2 5-4 10-2V4q-5-2-10 2',
 music:'M9 18V5l12-2v13 M9 18a3 3 0 1 1-3-3h3 M21 16a3 3 0 1 1-3-3h3',
 sleep:'M3 18h6l-6 4h6 M11 10h5l-5 5h5 M16 2h6l-6 5h6',
 shop:'M3 7h18l-1 14H4Z M8 7V5a4 4 0 0 1 8 0v2',
 exhibition:'M3 3h18v18H3Z M3 16l5-5 5 5 3-3 5 5 M16 8h.01',
 travel:'M22 2 9 15 M22 2l-4 20-5-9-11-5Z',
 unknown:'M9 9a3 3 0 1 1 5 2c-2 1-2 2-2 3 M12 18h.01',
 fog:'M3 8h18 M5 12h14 M3 16h18 M7 20h10',
 snow:'M12 2v20 M3.34 7l17.32 10 M3.34 17 20.66 7 M9 4l3 3 3-3 M9 20l3-3 3 3',
 storm:'M7 15a5 5 0 1 1 2-9 6 6 0 0 1 11 6 M13 11l-4 7h5l-3 5',
 happy:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20 M8 14s1.5 2 4 2 4-2 4-2 M9 9h.01 M15 9h.01',
 calm:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20 M8 9h.01 M16 9h.01 M8 15h8',
 tired:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20 M8 10h3 M13 10h3 M9 16q3-2 6 0',
 sad:'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20 M9 9h.01 M15 9h.01 M8 17q4-4 8 0',
 sunny:'M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41 M16 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0',
 partly_cloudy:'M17 18a5 5 0 0 0-9.7-1.7A4.5 4.5 0 0 0 6 16 M16 3v2 M21 8h-2 M18.4 5.6 17 7 M5 20a4 4 0 0 1-1-8 6 6 0 0 1 11-1 4.5 4.5 0 0 1 3 9Z',
 cloudy:'M17.5 19H9a7 7 0 1 1 6.71-9 5 5 0 1 1 1.79 9Z',
 rainy:'M16 13v-2a4 4 0 0 0-7.7-1.5A5 5 0 0 0 5 19h12a4 4 0 0 0-1-7.9 M8 19v2 M12 19v2 M16 19v2',
 night:'M12 3a6.4 6.4 0 0 0 9 9 9 9 0 1 1-9-9Z',
 dream:'M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4Z',
 love:'M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z',
 idea:'M9 18h6 M10 22h4 M15.09 14c.2-1 .8-1.7 1.5-2.4A5.5 5.5 0 1 0 7.4 11.6c.7.7 1.3 1.4 1.5 2.4Z'
};
function drawIcon(key,x,y,size){ctx.save();ctx.translate(x-size/2,y-size/2);ctx.scale(size/24,size/24);ctx.lineWidth=1.55;ctx.lineCap='round';ctx.lineJoin='round';ctx.strokeStyle=sceneColors.ink;ctx.stroke(new Path2D(iconPaths[key]||iconPaths.dream));ctx.restore();}
// Exact vector paths from the supplied logo.svg; embedded for offline PNG export.
const soleLogo=[{"d":"M48.547 106.703C52.0424 106.762 54.9345 107.728 57.0902 109.721C59.3555 111.745 60.4485 114.497 60.4485 117.839L60.446 118.17C60.4334 118.943 60.3765 119.715 60.2757 120.487C60.1583 121.386 59.9461 122.382 59.6456 123.47L56.1885 136.59L45.5301 138L46.2509 135.301C45.3366 135.866 44.4297 136.34 43.5299 136.719L43.5184 136.724C41.7994 137.426 40.0748 137.787 38.3519 137.787C35.9638 137.787 33.9239 137.148 32.3454 135.775L32.1941 135.64L32.188 135.634L32.182 135.629C30.5762 134.111 29.8126 132.09 29.8125 129.694C29.8125 126.256 31.4284 123.565 34.4976 121.71C37.5397 119.856 41.6575 118.99 46.7368 118.99L47.2101 118.992C47.6779 118.996 48.1293 119.006 48.5643 119.021L49.1348 119.046C49.434 119.061 49.7228 119.079 50.0009 119.1C50.0089 119.058 50.0126 119.019 50.0126 118.981C50.0126 117.83 49.6566 117.09 49.0562 116.586L49.0376 116.57L49.0195 116.553C48.4261 116.01 47.4877 115.655 46.0289 115.655C44.67 115.655 43.2029 115.887 41.6222 116.367C40.0403 116.848 38.2952 117.595 36.3839 118.62L35.6413 119.018L34.4215 117.8L37.6686 109.069L38.0913 108.873C39.7212 108.116 41.3444 107.561 42.96 107.215L42.9627 107.215L42.9652 107.214C44.6106 106.87 46.3589 106.701 48.2068 106.701L48.547 106.703ZM43.0889 135.675C42.8906 135.756 42.6924 135.832 42.4946 135.903C42.5928 135.868 42.6912 135.832 42.7895 135.794L43.0889 135.675ZM47.3357 125.117C44.6249 125.117 42.652 125.508 41.3187 126.189L41.314 126.191L41.3093 126.194C40.046 126.825 39.6494 127.544 39.6494 128.334L39.6516 128.433C39.6713 128.91 39.8366 129.198 40.1016 129.413C40.4249 129.675 40.9267 129.866 41.7276 129.866C42.7237 129.866 43.7472 129.706 44.802 129.379C45.7637 129.048 46.8273 128.561 47.9949 127.91L48.7214 125.172L48.6645 125.168C48.2215 125.134 47.7785 125.117 47.3357 125.117ZM39.6965 125.891C39.6779 125.907 39.6596 125.923 39.6414 125.939C39.668 125.916 39.695 125.893 39.7225 125.87L39.6965 125.891ZM45.1239 124.078C45.0814 124.082 45.0391 124.087 44.9969 124.091C45.1149 124.079 45.2343 124.068 45.3552 124.059L45.1239 124.078ZM59.1509 120.341L59.1846 120.067C59.185 120.063 59.1853 120.06 59.1857 120.056C59.1747 120.151 59.1633 120.246 59.1509 120.341ZM46.1918 114.524C46.1882 114.523 46.1847 114.523 46.1811 114.523L46.0289 114.522C46.0836 114.522 46.1379 114.523 46.1918 114.524ZM44.087 108.156C43.9986 108.171 43.9106 108.186 43.8228 108.202C44.0099 108.169 44.1985 108.137 44.3887 108.109L44.087 108.156Z","rule":"evenodd","fill":"black"},{"d":"M77.8734 108.913C78.4944 108.496 79.1189 108.139 79.7474 107.848C81.3201 107.083 82.9967 106.701 84.7634 106.701C87.7689 106.701 90.2672 107.834 92.1594 110.088C94.0806 112.334 94.9907 115.245 94.9907 118.709L94.9893 118.959C94.9615 121.533 94.5038 123.962 93.6085 126.238C92.7165 128.562 91.3929 130.587 89.6401 132.298C87.8678 134.066 85.8383 135.418 83.5573 136.344L83.542 136.35C81.2597 137.239 78.8138 137.678 76.2151 137.678C74.9208 137.678 73.6134 137.561 72.2937 137.327L72.0296 137.278L72.0241 137.277C70.8366 137.047 69.6651 136.716 68.5101 136.289L68.2793 136.202L62.5141 137.436L62.2946 137.483L60.2856 137.118L70.4312 96.302L81.7518 93.3706L77.8734 108.913ZM74.9846 136.508C74.9877 136.509 74.9908 136.508 74.9939 136.509C74.9842 136.508 74.9744 136.507 74.9646 136.507C74.9713 136.507 74.9779 136.508 74.9846 136.508ZM83.5289 135.127C83.3969 135.184 83.2639 135.24 83.13 135.295C83.2597 135.242 83.3886 135.188 83.5166 135.132L83.5289 135.127ZM75.9454 129.746L76.0103 129.746C75.9357 129.745 75.8615 129.744 75.7878 129.742C75.8401 129.743 75.8927 129.745 75.9454 129.746ZM77.6317 129.656C77.6428 129.654 77.654 129.653 77.6651 129.652C77.6721 129.651 77.6791 129.649 77.6862 129.648C77.668 129.651 77.6499 129.653 77.6317 129.656ZM78.0305 129.592C78.0374 129.591 78.0444 129.59 78.0513 129.589C78.0547 129.588 78.0581 129.587 78.0615 129.587C78.0512 129.588 78.0408 129.59 78.0305 129.592ZM78.2085 129.558C78.2197 129.556 78.2309 129.554 78.2421 129.552L78.2512 129.549C78.2369 129.552 78.2227 129.555 78.2085 129.558ZM80.8977 115.818C80.0601 115.818 79.1908 115.973 78.2846 116.296L78.2733 116.3L78.2618 116.304C77.4969 116.558 76.6551 116.959 75.7352 117.522L73.0553 128.277C73.3614 128.355 73.6712 128.417 73.9849 128.464C74.6863 128.564 75.4472 128.615 76.2696 128.615C78.1937 128.615 79.8886 128.03 81.394 126.846L81.3984 126.842L81.403 126.839C82.948 125.649 83.947 124.142 84.4276 122.287L84.433 122.266L84.4393 122.245C84.5224 121.968 84.5824 121.648 84.6132 121.28L84.6164 121.241L84.6225 121.201C84.6871 120.782 84.718 120.386 84.718 120.014C84.718 118.59 84.3608 117.607 83.77 116.932L83.7123 116.867C83.1011 116.206 82.2155 115.818 80.8977 115.818ZM85.5652 117.908C85.5907 117.991 85.6146 118.076 85.6367 118.161L85.6025 118.034C85.5906 117.991 85.578 117.95 85.5652 117.908ZM74.9553 116.672C74.8856 116.716 74.8154 116.761 74.7451 116.806C74.8312 116.75 74.9171 116.696 75.0024 116.643C74.9868 116.653 74.971 116.663 74.9553 116.672ZM81.3365 114.698C81.3335 114.698 81.3305 114.698 81.3275 114.697L81.1862 114.691C81.2367 114.693 81.2868 114.695 81.3365 114.698ZM91.166 110.671L91.1443 110.646C91.1304 110.63 91.1159 110.614 91.1019 110.599C91.1233 110.623 91.1448 110.647 91.166 110.671ZM85.2611 107.845C85.3409 107.849 85.4202 107.853 85.499 107.859C85.3392 107.848 85.1775 107.84 85.0139 107.836L85.2611 107.845Z","rule":"evenodd","fill":"black"},{"d":"M21.1415 96.9666L13.6279 127.147H28.8728L26.3494 137.298H0L10.0378 96.9666H21.1415Z","rule":"nonzero","fill":"black"},{"d":"M26.6057 42.0023C29.4153 42.0023 31.9931 42.4577 34.3229 43.3884C36.6072 44.2869 38.7146 45.6334 40.6455 47.412L40.8322 47.5856L41.2954 48.0217L39.0685 58.5698H37.4502L37.1099 58.1578C35.5259 56.2392 33.8927 54.833 32.2192 53.901L32.0572 53.8122L32.0498 53.8084L32.0424 53.8043C30.3759 52.876 28.6114 52.4007 26.7332 52.3719L26.5512 52.3706C23.8075 52.3706 21.3342 53.2546 19.0959 55.0564L19.0918 55.0597L19.0876 55.0627C16.8546 56.8269 15.4161 59.0729 14.7497 61.8353L14.7467 61.8487L14.7431 61.8618C14.6117 62.3539 14.5123 62.8652 14.4458 63.3961L14.4447 63.4054C14.3787 63.8999 14.3456 64.3937 14.3456 64.8869C14.3457 67.4472 15.1558 69.4443 16.7258 70.982C18.2908 72.4791 20.3838 73.2703 23.1209 73.2703C25.0267 73.2703 26.9669 72.8705 28.9486 72.0515C30.9361 71.2301 33.0622 69.9483 35.3267 68.1813L36.0111 67.6474L37.6163 68.85L33.0188 80.4499L32.6917 80.6476C31.0311 81.6504 29.221 82.3994 27.267 82.8968C25.3186 83.3929 23.2819 83.6388 21.1607 83.6388C15.8856 83.6388 11.5318 82.0854 8.2155 78.8968L8.05837 78.7437L8.05591 78.7415L8.05344 78.739C4.71879 75.4086 3.09332 71.0043 3.09327 65.6483C3.09327 62.4303 3.66243 59.3702 4.80579 56.4772L4.81071 56.4652C5.99192 53.573 7.67257 51.0346 9.85028 48.8596C12.0269 46.6494 14.5684 44.9522 17.4655 43.772C20.3634 42.5914 23.4132 42.0023 26.6057 42.0023ZM20.9217 82.5048L21.1607 82.5059C21.0757 82.5059 20.991 82.5054 20.9067 82.5045C20.9117 82.5046 20.9167 82.5047 20.9217 82.5048ZM23.1209 74.4033L23.309 74.4019C23.3571 74.4013 23.4052 74.4002 23.4533 74.3992C23.3424 74.4016 23.2317 74.4033 23.1209 74.4033ZM28.8432 73.311C28.8914 73.2928 28.9398 73.2748 28.988 73.2561L28.994 73.2536C28.9438 73.2731 28.8934 73.292 28.8432 73.311ZM37.6226 57.0076C37.599 56.9803 37.5753 56.953 37.5517 56.9259C37.4855 56.8497 37.4192 56.7741 37.3527 56.6995C37.443 56.8007 37.5329 56.9035 37.6226 57.0076ZM33.2258 53.176C33.1862 53.152 33.1467 53.1279 33.107 53.1044L32.9477 53.0111C33.0406 53.0647 33.1333 53.1199 33.2258 53.176ZM10.083 50.2509C10.0559 50.2801 10.0291 50.3097 10.0022 50.339C10.0477 50.2895 10.0933 50.2399 10.1393 50.1908C10.1206 50.2109 10.1016 50.2308 10.083 50.2509ZM10.2699 50.0519C10.2508 50.0719 10.232 50.0922 10.213 50.1123C10.2804 50.0411 10.3482 49.9701 10.4166 49.8996C10.3675 49.9502 10.3185 50.0009 10.2699 50.0519ZM11.0443 49.2722L10.8472 49.4649C10.9259 49.387 11.0053 49.3099 11.0848 49.2334C11.0714 49.2463 11.0578 49.2592 11.0443 49.2722ZM11.8524 48.5294C11.715 48.6493 11.5789 48.7711 11.4443 48.8949C11.423 48.9145 11.402 48.9345 11.3808 48.9542C11.5648 48.7837 11.7514 48.6167 11.9406 48.4534C11.9112 48.4787 11.8816 48.5039 11.8524 48.5294ZM12.0596 48.3508C12.0303 48.3758 12.0012 48.4009 11.972 48.426C12.0703 48.3415 12.1692 48.2579 12.2688 48.1753L12.0596 48.3508ZM33.7585 44.3841C33.7401 44.377 33.7217 44.3696 33.7032 44.3625L33.6966 44.3601C33.7173 44.368 33.7379 44.3761 33.7585 44.3841Z","rule":"evenodd","fill":"black"},{"d":"M84.4109 69.5663L84.4062 69.5847L84.401 69.603C84.2693 70.0633 84.1731 70.4637 84.1087 70.8065C84.0785 71.1196 84.0635 71.4121 84.0635 71.6843C84.0635 72.5775 84.2993 73.1555 84.6586 73.5478C85.0514 73.9058 85.6297 74.1405 86.5228 74.1405C87.3307 74.1405 88.1775 73.9618 89.0708 73.5795L89.077 73.5768L89.0836 73.574C89.9358 73.2219 90.871 72.6833 91.8906 71.9411L96.635 52.9327H107.194L99.7149 82.9862H89.3801L89.907 80.8272C89.1978 81.3841 88.4874 81.8595 87.7754 82.2489L87.7664 82.2538L87.7571 82.2587C86.0791 83.1365 84.3202 83.5844 82.4936 83.5844C79.9169 83.5844 77.7146 82.7809 75.9777 81.131L75.8113 80.9686L75.8017 80.959C74.0739 79.1912 73.2467 76.8962 73.2466 74.1859C73.2466 73.354 73.326 72.4591 73.4788 71.5053C73.631 70.5192 73.8746 69.3809 74.2053 68.0955L77.9577 52.9327H88.5745L84.4109 69.5663ZM82.2705 82.4493L82.4936 82.4515C82.3453 82.4515 82.1987 82.4483 82.0537 82.4424C82.1255 82.4453 82.1978 82.4478 82.2705 82.4493ZM81.4293 82.3984C81.4725 82.4029 81.516 82.4063 81.5596 82.4102C81.5071 82.4055 81.4548 82.4009 81.4027 82.3954L81.4293 82.3984ZM76.8986 80.4387C76.8503 80.395 76.8024 80.3505 76.7549 80.3053L76.753 80.3037C76.8011 80.3494 76.8497 80.3944 76.8986 80.4387ZM74.389 74.6209C74.3865 74.5528 74.3845 74.4843 74.3832 74.4156L74.3829 74.4136C74.3843 74.4831 74.3864 74.5522 74.389 74.6209ZM83.328 73.5924C83.3471 73.6308 83.3671 73.6687 83.3876 73.7061C83.3637 73.6625 83.3407 73.6182 83.3186 73.5732L83.328 73.5924Z","rule":"evenodd","fill":"black"},{"d":"M134.462 52.3345C136.443 52.3345 138.356 52.5817 140.198 53.0792C141.952 53.544 143.582 54.1957 145.082 55.0375L145.381 55.2087L146 55.5707L145.274 63.8775L143.857 64.3491L143.388 64.0156C141.826 62.9062 140.262 62.0681 138.697 61.4905L138.687 61.4867L138.677 61.4828C137.217 60.9122 135.829 60.6196 134.508 60.5853L134.244 60.582C133.197 60.582 132.492 60.7643 132.036 61.0276C131.607 61.2761 131.568 61.4703 131.568 61.6242C131.568 61.8239 131.64 62.0632 132.006 62.3643C132.487 62.727 133.577 63.2732 135.421 63.9954C138.179 65.075 140.306 66.3505 141.673 67.8781C143.11 69.4063 143.818 71.2985 143.818 73.4789L143.815 73.7657C143.739 76.7106 142.484 79.123 140.098 80.9106C137.669 82.7299 134.521 83.5844 130.76 83.5844C128.797 83.5844 126.88 83.3502 125.012 82.881L124.639 82.7842L124.629 82.7815L124.62 82.7787C122.76 82.2429 121.108 81.515 119.677 80.5845L119.393 80.3955L118.942 80.0877L118.31 71.4889L119.741 70.5358L120.394 71.099C121.8 72.312 123.372 73.2864 125.114 74.023L125.464 74.167C127.351 74.9207 129.113 75.2825 130.76 75.2825C131.915 75.2825 132.723 75.1003 133.264 74.8226C133.793 74.5161 133.818 74.2935 133.818 74.1859C133.818 74.0497 133.772 73.8321 133.389 73.5336L133.308 73.4729L133.292 73.4611L133.276 73.4488C132.757 73.0457 131.706 72.4958 130.008 71.8104C127.281 70.7343 125.173 69.5256 123.803 68.1376L123.673 68.0025L123.662 67.9905L123.651 67.9779C122.278 66.4361 121.622 64.506 121.622 62.2768C121.622 59.2733 122.861 56.8197 125.281 55.0135C127.673 53.191 130.769 52.3345 134.462 52.3345ZM130.386 82.4485L130.76 82.4512C130.513 82.4512 130.266 82.4472 130.02 82.4394C130.142 82.4433 130.264 82.4465 130.386 82.4485ZM131.395 82.4422C131.413 82.4417 131.43 82.4413 131.448 82.4408C131.543 82.438 131.639 82.4345 131.733 82.4304C131.621 82.4351 131.509 82.4391 131.395 82.4422ZM131.737 82.4301C131.742 82.4299 131.747 82.4301 131.752 82.4299C131.86 82.4251 131.967 82.4196 132.074 82.4132C131.963 82.4199 131.85 82.4254 131.737 82.4301ZM134.938 74.4002C134.942 74.3694 134.946 74.3382 134.948 74.3067V74.3048C134.946 74.3369 134.942 74.3687 134.938 74.4002ZM122.758 62.4627C122.758 62.4701 122.758 62.4775 122.759 62.4848C122.758 62.472 122.758 62.4591 122.758 62.4463L122.758 62.4627ZM131.343 60.1235C131.315 60.141 131.289 60.1589 131.263 60.1768C131.293 60.1562 131.324 60.1358 131.355 60.1156L131.343 60.1235ZM134.737 59.4603C134.671 59.4574 134.604 59.4546 134.538 59.4529L134.513 59.4523C134.587 59.4543 134.662 59.457 134.737 59.4603Z","rule":"evenodd","fill":"black"},{"d":"M54.8143 54.7877C55.4576 54.3043 56.1017 53.8908 56.748 53.5519L56.7584 53.5464C58.3989 52.7073 60.118 52.2801 61.9034 52.2801L62.1514 52.2825C64.7029 52.3344 66.8659 53.1917 68.541 54.9055C70.3063 56.6738 71.1506 58.9886 71.1506 61.733L71.1468 62.048C71.1295 62.7895 71.0522 63.5788 70.9185 64.4134C70.7664 65.3629 70.5222 66.5027 70.1909 67.8262L66.4395 82.9862H55.8225L59.982 66.3692C60.0869 65.9152 60.1732 65.5002 60.2418 65.1239C60.306 64.7362 60.3335 64.4242 60.3335 64.1802C60.3335 63.3404 60.1115 62.8133 59.7772 62.4616L59.7091 62.3935L59.6973 62.3823L59.6858 62.3708C59.3382 62.0237 58.7898 61.7784 57.8745 61.7784C57.1069 61.7784 56.2563 61.9552 55.3134 62.3449C54.4564 62.699 53.5201 63.2244 52.5034 63.9352L47.7628 82.9862H37.2035L47.408 41.9903L58.7269 39.0595L54.8143 54.7877ZM70.0162 61.7327C70.0162 61.9214 70.0115 62.1147 70.0025 62.3123C70.007 62.2145 70.0107 62.1177 70.0129 62.022L70.0162 61.7327ZM59.2996 60.8519L59.2892 60.8483C59.2434 60.8334 59.1969 60.8195 59.1498 60.8062C59.2005 60.8205 59.2504 60.8357 59.2996 60.8519Z","rule":"evenodd","fill":"black"},{"d":"M122.743 43.3316C123.158 44.2732 123.471 45.1627 123.672 45.9964C123.914 46.8117 124.037 47.6356 124.037 48.4646L124.034 48.6849C123.971 50.9563 122.925 53.1301 121.089 55.1909C119.239 57.3087 116.243 59.6444 112.183 62.2019L111.476 62.6467L107.659 59.3916L108.558 58.525C110.592 56.5648 111.976 54.8925 112.771 53.5035L112.776 53.4948L112.781 53.486C113.61 52.0949 113.982 50.8248 113.982 49.6607C113.982 49.1208 113.881 48.4939 113.652 47.7721L113.605 47.6263L113.603 47.6198L113.601 47.6135C113.368 46.8853 112.983 45.948 112.436 44.7926L112.191 44.2841L111.397 42.6549H122.445L122.743 43.3316ZM119.999 54.7097C120.022 54.6844 120.045 54.6593 120.068 54.634L120.105 54.5927C120.07 54.6316 120.034 54.6706 119.999 54.7097ZM115.074 50.4111C115.078 50.3832 115.081 50.3553 115.084 50.3275L115.085 50.3105C115.082 50.344 115.078 50.3776 115.074 50.4111ZM115.108 49.9907C115.109 49.9693 115.111 49.9478 115.112 49.9264V49.9223C115.111 49.9451 115.11 49.9679 115.108 49.9907ZM122.898 48.7019C122.899 48.685 122.9 48.6681 122.9 48.6513L122.901 48.6272C122.9 48.6521 122.899 48.677 122.898 48.7019Z","rule":"evenodd","fill":"black"},{"d":"M116.336 0C123.853 0 129.948 6.08667 129.948 13.5949C129.948 21.103 123.853 27.1897 116.336 27.1897C108.818 27.1897 102.724 21.103 102.724 13.5949C102.724 6.08667 108.818 1.15449e-06 116.336 0Z","rule":"nonzero","fill":"black"}].map(p=>({...p,path:new Path2D(p.d)}));
const sceneColors={background:'#a8a8a8',bag:'#FFFFFF',ink:'#202020'};
let packageFont='Arial';
const bagSockTransform={scale:100,x:0,y:0};
// Inner pouch boundary below the zipper; shared by preview and PNG drawing.
const bagInterior=new Path2D('M154 205 L926 205 L926 1268 Q926 1290 904 1290 L176 1290 Q154 1290 154 1268 Z');
const packageTextSizes={};
const packageTextEntries=[];
const packageIconSizes=[39,39,39,39];
const packageRingSizes=[68,68,68,68];
const activityEnglishLabels={"walk": "WALK", "short_walk": "SHORT WALK", "outing": "NATURE WALK", "bike": "CYCLING", "zoo": "ZOO", "seaside": "SEASIDE", "camera": "PHOTOGRAPHY", "dessert": "DESSERT", "stargazing": "STARGAZING", "movie": "MOVIE", "camping": "CAMPING", "cafe": "CAF\u00c9", "coffee": "COFFEE", "tea": "HOT TEA", "music": "MUSIC", "snack": "SNACK", "dinner": "DINNER", "ramen": "RAMEN", "hotpot": "HOT POT", "brunch": "BRUNCH", "bakery": "BREAD", "icecream": "ICE CREAM", "book": "READING", "journal": "JOURNALING", "sleep": "SLEEP", "sofa": "SOFA REST", "bath": "BATH", "blanket": "COZY BLANKET", "aroma": "AROMATHERAPY", "headphones": "HEADPHONES", "game": "GAMING", "rest": "REST", "charge": "RECHARGE", "home": "GO HOME", "checklist": "CHECKLIST", "note": "TAKE NOTES", "breathing": "BREATHE", "shutdown": "SWITCH OFF", "run": "RUNNING", "cold_drink": "COLD DRINK", "bench": "TAKE A SEAT", "tissue": "DRY YOUR TEARS"};
const moodState={mood:'happy',weather:'partly_cloudy',thought:'unknown',activityLabel:'ACTIVITY UNAVAILABLE',note:[]};
// Lucide 0.468.0, ISC license; original 24-unit geometry shared by HTML and PNG.
Object.assign(iconPaths,{"frown": "M2.0 12.0a10.0 10.0 0 1 0 20.0 0a10.0 10.0 0 1 0 -20.0 0 M16 16s-1.5-2-4-2-4 2-4 2 M9 9L9.01 9 M15 9L15.01 9", "gamepad-2": "M6 11L10 11 M8 9L8 13 M15 12L15.01 12 M18 10L18.01 10 M17.32 5H6.68a4 4 0 0 0-3.978 3.59c-.006.052-.01.101-.017.152C2.604 9.416 2 14.456 2 16a3 3 0 0 0 3 3c1 0 1.5-.5 2-1l1.414-1.414A2 2 0 0 1 9.828 16h4.344a2 2 0 0 1 1.414.586L17 18c.5.5 1 1 2 1a3 3 0 0 0 3-3c0-1.545-.604-6.584-.685-7.258-.007-.05-.011-.1-.017-.151A4 4 0 0 0 17.32 5z", "paw-print": "M9.0 4.0a2.0 2.0 0 1 0 4.0 0a2.0 2.0 0 1 0 -4.0 0 M16.0 8.0a2.0 2.0 0 1 0 4.0 0a2.0 2.0 0 1 0 -4.0 0 M18.0 16.0a2.0 2.0 0 1 0 4.0 0a2.0 2.0 0 1 0 -4.0 0 M9 10a5 5 0 0 1 5 5v3.5a3.5 3.5 0 0 1-6.84 1.045Q6.52 17.48 4.46 16.84A3.5 3.5 0 0 1 5.5 10Z", "footprints": "M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z M16 17h4 M4 13h4", "cookie": "M12 2a10 10 0 1 0 10 10 4 4 0 0 1-5-5 4 4 0 0 1-5-5 M8.5 8.5v.01 M16 15.5v.01 M12 12v.01 M11 17v.01 M7 14v.01", "waves": "M2 6c.6.5 1.2 1 2.5 1C7 7 7 5 9.5 5c2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 M2 12c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 M2 18c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 2.6 0 2.4 2 5 2 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1", "bath": "M10 4 8 6 M17 19v2 M2 12h20 M7 19v2 M9 5 7.621 3.621A2.121 2.121 0 0 0 4 5v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5", "coffee": "M10 2v2 M14 2v2 M16 8a1 1 0 0 1 1 1v8a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V9a1 1 0 0 1 1-1h14a4 4 0 1 1 0 8h-1 M6 2v2", "star": "M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z", "book-open": "M12 7v14 M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z", "trees": "M10 10v.2A3 3 0 0 1 8.9 16H5a3 3 0 0 1-1-5.8V10a3 3 0 0 1 6 0Z M7 16v6 M13 19v3 M12 19h8.3a1 1 0 0 0 .7-1.7L18 14h.3a1 1 0 0 0 .7-1.7L16 9h.2a1 1 0 0 0 .8-1.7L13 3l-1.4 1.5", "cup-soda": "m6 8 1.75 12.28a2 2 0 0 0 2 1.72h4.54a2 2 0 0 0 2-1.72L18 8 M5 8h14 M7 15a6.47 6.47 0 0 1 5 0 6.47 6.47 0 0 0 5 0 m12 8 1-6h2", "armchair": "M19 9V6a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v3 M3 16a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-5a2 2 0 0 0-4 0v1.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V11a2 2 0 0 0-4 0z M5 18v2 M19 18v2", "clapperboard": "M20.2 6 3 11l-.9-2.4c-.3-1.1.3-2.2 1.3-2.5l13.5-4c1.1-.3 2.2.3 2.5 1.3Z m6.2 5.3 3.1 3.9 m12.4 3.4 3.1 4 M3 11h18v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z", "flame-kindling": "M12 2c1 3 2.5 3.5 3.5 4.5A5 5 0 0 1 17 10a5 5 0 1 1-10 0c0-.3 0-.6.1-.9a2 2 0 1 0 3.3-2C8 4.5 11 2 12 2Z m5 22 14-4 m5 18 14 4", "heart-handshake": "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z M12 5 9.04 7.96a2.17 2.17 0 0 0 0 3.08c.82.82 2.13.85 3 .07l2.07-1.9a2.82 2.82 0 0 1 3.79 0l2.96 2.66 m18 15-2-2 m15 18-2-2", "utensils": "M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2 M7 2v20 M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7", "ice-cream-bowl": "M12 17c5 0 8-2.69 8-6H4c0 3.31 3 6 8 6m-4 4h8m-4-3v3M5.14 11a3.5 3.5 0 1 1 6.71 0 M12.14 11a3.5 3.5 0 1 1 6.71 0 M15.5 6.5a3.5 3.5 0 1 0-7 0", "bike": "M15.0 17.5a3.5 3.5 0 1 0 7.0 0a3.5 3.5 0 1 0 -7.0 0 M2.0 17.5a3.5 3.5 0 1 0 7.0 0a3.5 3.5 0 1 0 -7.0 0 M14.0 5.0a1.0 1.0 0 1 0 2.0 0a1.0 1.0 0 1 0 -2.0 0 M12 17.5V14l-3-3 4-3 2 3h2", "tent-tree": "M2.0 4.0a2.0 2.0 0 1 0 4.0 0a2.0 2.0 0 1 0 -4.0 0 m14 5 3-3 3 3 m14 10 3-3 3 3 M17 14V2 M17 14H7l-5 8h20Z M8 14v8 m9 14 5 8", "soup": "M12 21a9 9 0 0 0 9-9H3a9 9 0 0 0 9 9Z M7 21h10 M19.5 12 22 6 M16.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.73 1.62 M11.25 3c.27.1.8.53.74 1.36-.05.83-.93 1.2-.98 2.02-.06.78.33 1.24.72 1.62 M6.25 3c.27.1.8.53.75 1.36-.06.83-.93 1.2-1 2.02-.05.78.34 1.24.74 1.62", "wind": "M12.8 19.6A2 2 0 1 0 14 16H2 M17.5 8a2.5 2.5 0 1 1 2 4H2 M9.8 4.4A2 2 0 1 1 11 8H2", "bed": "M2 4v16 M2 8h18a2 2 0 0 1 2 2v10 M2 17h20 M6 8v9", "notebook-pen": "M13.4 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7.4 M2 6h4 M2 10h4 M2 14h4 M2 18h4 M21.378 5.626a1 1 0 1 0-3.004-3.004l-5.01 5.012a2 2 0 0 0-.506.854l-.837 2.87a.5.5 0 0 0 .62.62l2.87-.837a2 2 0 0 0 .854-.506z", "battery-charging": "M15 7h1a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2 M6 7H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h1 m11 7-3 5h4l-3 5 M22 11L22 13", "list-checks": "m3 17 2 2 4-4 m3 7 2 2 4-4 M13 6h8 M13 12h8 M13 18h8", "pause": "M15.0 4.0h2.0q1.0 0 1.0 1.0v14.0q0 1.0 -1.0 1.0h-2.0q-1.0 0 -1.0 -1.0v-14.0q0 -1.0 1.0 -1.0Z M7.0 4.0h2.0q1.0 0 1.0 1.0v14.0q0 1.0 -1.0 1.0h-2.0q-1.0 0 -1.0 -1.0v-14.0q0 -1.0 1.0 -1.0Z", "sunset": "M12 10V2 m4.93 10.93 1.41 1.41 M2 18h2 M20 18h2 m19.07 10.93-1.41 1.41 M22 22H2 m16 6-4 4-4-4 M16 18a4 4 0 0 0-8 0", "house": "M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8 M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z", "person-standing": "M11.0 5.0a1.0 1.0 0 1 0 2.0 0a1.0 1.0 0 1 0 -2.0 0 m9 20 3-6 3 6 m6 8 6 2 6-2 M12 10v4", "meh": "M2.0 12.0a10.0 10.0 0 1 0 20.0 0a10.0 10.0 0 1 0 -20.0 0 M8 15L16 15 M9 9L9.01 9 M15 9L15.01 9", "cake-slice": "M7.0 7.0a2.0 2.0 0 1 0 4.0 0a2.0 2.0 0 1 0 -4.0 0 M7.2 7.9 3 11v9c0 .6.4 1 1 1h16c.6 0 1-.4 1-1v-9c0-2-3-6-7-8l-3.6 2.6 M16 13H3 M16 17H3", "headphones": "M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3", "power": "M12 2v10 M18.4 6.6a9 9 0 1 1-12.77.04", "croissant": "m4.6 13.11 5.79-3.21c1.89-1.05 4.79 1.78 3.71 3.71l-3.22 5.81C8.8 23.16.79 15.23 4.6 13.11Z m10.5 9.5-1-2.29C9.2 6.48 8.8 6 8 6H4.5C2.79 6 2 6.5 2 8.5a7.71 7.71 0 0 0 2 4.83 M8 6c0-1.55.24-4-2-4-2 0-2.5 2.17-2.5 4 m14.5 13.5 2.29 1c.73.3 1.21.7 1.21 1.5v3.5c0 1.71-.5 2.5-2.5 2.5a7.71 7.71 0 0 1-4.83-2 M18 16c1.55 0 4-.24 4 2 0 2-2.17 2.5-4 2.5", "camera": "M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z M9.0 13.0a3.0 3.0 0 1 0 6.0 0a3.0 3.0 0 1 0 -6.0 0"});
iconPaths.anxious=iconPaths.meh;iconPaths.lonely=iconPaths.frown;
let scenarioData=null, scenarioKey='', currentScenario=null, noteEdited=false;
const SCENARIO_TIME={day:6,evening:17,night:19};

let showPackaging = true;
let sockBase='white';
// One seed per visit: fresh initial artwork, stable scenario designs within the visit.
const visitSeed=Array.from(crypto.getRandomValues(new Uint32Array(2))).join('-');
const initialRandom=stripeRandom(stripeSeed(visitSeed));
const initialPick=items=>items[Math.floor(initialRandom()*items.length)];
const initialDesign=buildStripeDesign({mood:initialPick(['happy','calm','tired','sad','anxious','angry','lonely']),weather:initialPick(['sunny','cloudy','rainy','windy','stormy']),timeOfDay:scenarioTime(),thought:visitSeed,activity:visitSeed});
initialDesign.stripeOrder=shuffleStripeOrder(initialDesign.stripeOrder);
let colors=initialDesign.stripeOrder.map(i=>initialDesign.palette[i]);
let widths=[...initialDesign.stripeWidths];
let gaps=[...initialDesign.stripeGaps];
let currentActivity=null,currentStripeDesign=null;
let paletteChoice=0,paletteScenarioKey='';
// Vector artwork is rendered at the exact export resolution; no external assets required.
// Shorter, wider crew silhouette with a rounded toe and fuller heel, matched to the reference.
const outline = new Path2D('M 12 0 Q 0 0 0 13 L 0 455 Q 0 481 -30 503 L -242 657 Q -306 704 -276 762 Q -252 810 -198 832 Q -150 852 -103 821 L 101 663 Q 127 645 164 637 Q 226 625 228 582 Q 231 558 213 517 Q 200 488 200 453 L 200 13 Q 200 0 188 0 Z');
function sock(x,y,front){
 const dark=sockBase==='black';
 ctx.save();ctx.translate(x,y);ctx.scale(1.28,1.28);
 // CSS is the source of truth; Canvas mirrors it for identical PNG export.
 ctx.shadowColor=sockShadow.color;ctx.shadowBlur=sockShadow.blur;ctx.shadowOffsetX=sockShadow.x;ctx.shadowOffsetY=sockShadow.y;
 ctx.fillStyle=dark?'#191919':'#eeeeec';ctx.fill(outline);ctx.shadowColor='transparent';
 ctx.save();ctx.clip(outline);
 const shade=ctx.createLinearGradient(0,0,200,0);shade.addColorStop(0,dark?'#151515':'#e5e5e2');shade.addColorStop(.2,dark?'#292929':'#f3f3ef');shade.addColorStop(.8,dark?'#202020':'#efefed');shade.addColorStop(1,dark?'#101010':'#dedfda');ctx.fillStyle=shade;ctx.fillRect(-370,-5,630,1060);
 // Each band has its own width and each adjacent pair has its own gap.
 let stripeY=58;
 colors.forEach((color,i)=>{
 ctx.fillStyle=color;ctx.fillRect(0,stripeY,200,widths[i]);
 stripeY+=widths[i]+(gaps[i] ?? 0);
 });
 for(let i=5;i<200;i+=8){
 ctx.strokeStyle=dark?'#00000045':'#8c91832e';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(i,5);ctx.lineTo(i,430);ctx.stroke();
 ctx.strokeStyle=dark?'#ffffff16':'#ffffff65';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(i+3,5);ctx.lineTo(i+3,430);ctx.stroke();
 }
 ctx.strokeStyle=dark?'#ffffff30':'#ffffff90';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(4,3);ctx.lineTo(196,3);ctx.stroke();
 ctx.strokeStyle=dark?'#ffffff12':'#d8d9d427';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(-242,657);ctx.quadraticCurveTo(-222,702,-225,758);ctx.stroke();
 if(front){
 ctx.save();ctx.translate(-62,720);ctx.rotate(-.64);
 // Reference layout: logo sits after the text toward the heel, slightly above its center.
 ctx.save();ctx.translate(112,-29);ctx.scale(46/146,46/146);
 for(const part of soleLogo){ctx.fillStyle=sceneColors.background;ctx.fill(part.path,part.rule);}
 ctx.restore();
 ctx.fillStyle=sceneColors.background;ctx.textAlign='left';
 ctx.font='bold 16px Arial';ctx.fillText('ONE DAY ONE MOOD',-75,-7);
 ctx.font='7.5px Arial';ctx.fillText('WALK WITH YOU THROUGH EVERY STEP',-75,7);
 ctx.font='7.5px Arial';ctx.fillText('www.instagram.com/chu.s.lab/',-75,19);
 ctx.restore();
 }
 ctx.restore();ctx.restore();
}
// Curved fold ribbons use crosswise lighting, so highlights follow the surface normal.
// Fixed geometry prevents wrinkles from moving when the user changes stripe colors.
const filmFolds = [
 [156,207,205,245,333,229,17,.32], [159,210,172,291,211,338,10,.22],
 [924,208,865,238,756,263,19,.31], [922,219,906,313,850,380,12,.25],
 [157,514,180,628,166,804,13,.18], [926,492,886,670,916,826,19,.22],
 [159,1286,227,1198,399,1192,24,.34], [167,1291,350,1250,510,1272,13,.23],
 [918,1289,854,1188,884,1045,23,.32], [914,1290,766,1265,656,1219,16,.25],
 [353,1220,499,1177,632,1208,20,.12], [759,319,802,452,777,588,23,.10],
 [381,862,339,934,277,966,18,.11]
];
function drawFilmFolds(surfaceOnly){
 ctx.save();
 for(const [x0,y0,cx,cy,x1,y1,width,strength] of filmFolds){
 const point=t=>({x:(1-t)*(1-t)*x0+2*(1-t)*t*cx+t*t*x1,y:(1-t)*(1-t)*y0+2*(1-t)*t*cy+t*t*y1});
 for(let i=0;i<56;i++){
 const t=i/56,u=(i+1)/56,p=point(t),q=point(u),m=(t+u)/2;
 const dx=2*(1-m)*(cx-x0)+2*m*(x1-cx),dy=2*(1-m)*(cy-y0)+2*m*(y1-cy),length=Math.hypot(dx,dy)||1;
 const nx=-dy/length,ny=dx/length;
 const w=width*(.18+.82*Math.sin(Math.PI*m))*(1-.55*m);
 const alpha=strength*Math.pow(1-m,.75)*(surfaceOnly?.30:1);
 const gradient=ctx.createLinearGradient(p.x-nx*w,p.y-ny*w,p.x+nx*w,p.y+ny*w);
 gradient.addColorStop(0,'rgba(255,255,255,0)');
 gradient.addColorStop(.23,`rgba(67,57,49,${surfaceOnly?0:alpha*.24})`);
 gradient.addColorStop(.43,`rgba(100,93,83,${surfaceOnly?0:alpha*.13})`);
 gradient.addColorStop(.54,`rgba(255,255,255,${alpha})`);
 gradient.addColorStop(.67,`rgba(255,255,255,${alpha*.44})`);
 gradient.addColorStop(1,'rgba(255,255,255,0)');
 ctx.fillStyle=gradient;ctx.beginPath();ctx.moveTo(p.x-nx*w,p.y-ny*w);ctx.lineTo(q.x-nx*w,q.y-ny*w);ctx.lineTo(q.x+nx*w,q.y+ny*w);ctx.lineTo(p.x+nx*w,p.y+ny*w);ctx.closePath();ctx.fill();
 }
 }
 ctx.restore();
}
// Transparent vector packaging: the sock artwork remains editable underneath.
function drawPackaging(){
 ctx.save();
 const bag=new Path2D('M 164 35 L 916 35 Q 945 35 945 66 L 945 1280 Q 945 1310 916 1310 L 164 1310 Q 135 1310 135 1280 L 135 66 Q 135 35 164 35 Z');
 // Thin flexible film, with restrained lighting rather than a rigid outlined frame.
 ctx.save();ctx.shadowColor='#351b102b';ctx.shadowBlur=14;ctx.shadowOffsetX=5;ctx.shadowOffsetY=8;ctx.strokeStyle='#ffffff40';ctx.lineWidth=3;ctx.stroke(bag);ctx.restore();
 ctx.fillStyle=sceneColors.bag+'38';ctx.fill(bag);
 const film=ctx.createLinearGradient(140,0,940,0);
 [[0,'#ffffff50'],[.035,'#ffffff22'],[.3,'#ffffff12'],[.65,'#ffffff20'],[.96,'#ffffff18'],[1,'#ffffff55']].forEach(([p,c])=>film.addColorStop(p,c));ctx.fillStyle=film;ctx.fill(bag);
 ctx.save();ctx.clip(bag);
 // Softbox reflections spread across the film, not narrow painted stripes.
 for(const [x,y,rx,ry,alpha,angle] of [[260,600,140,570,.14,-.08],[855,770,80,480,.16,.05],[500,1230,350,75,.16,-.04]]){
 ctx.save();ctx.translate(x,y);ctx.rotate(angle);ctx.scale(rx,ry);const glow=ctx.createRadialGradient(0,0,0,0,0,1);glow.addColorStop(0,`rgba(255,255,255,${alpha})`);glow.addColorStop(.5,`rgba(255,255,255,${alpha*.4})`);glow.addColorStop(1,'#ffffff00');ctx.fillStyle=glow;ctx.fillRect(-1,-1,2,2);ctx.restore();
 }
 // Fold cross-sections carry a soft shadow, a narrow crest, and a fading shoulder.
 drawFilmFolds(false);
 ctx.restore();
 ctx.strokeStyle='#ffffff65';ctx.lineWidth=2;ctx.stroke(bag);
 // Heat-welded side and bottom bands, with no opaque metal-like border.
 const seam=new Path2D('M 152 205 Q 158 650 152 1269 Q 152 1292 176 1292 L 904 1292 Q 929 1292 928 1268 Q 920 680 928 205');
 ctx.strokeStyle='#ffffff24';ctx.lineWidth=10;ctx.stroke(seam);ctx.strokeStyle='#ffffff60';ctx.lineWidth=1;ctx.stroke(seam);
 const header=ctx.createLinearGradient(0,54,0,164);header.addColorStop(0,'#ffffff38');header.addColorStop(1,'#ffffff12');ctx.fillStyle=header;ctx.fillRect(154,54,772,110);
 ctx.beginPath();ctx.arc(540,101,22,0,Math.PI*2);ctx.fillStyle=sceneColors.background;ctx.fill();ctx.strokeStyle='#503c3033';ctx.lineWidth=2;ctx.stroke();ctx.beginPath();ctx.arc(540,100,24,Math.PI,Math.PI*2);ctx.strokeStyle='#ffffff80';ctx.lineWidth=1.5;ctx.stroke();
 const zipper=ctx.createLinearGradient(0,176,0,195);
 [[0,'#ffffff28'],[.2,'#ffffff90'],[.38,'#574d452a'],[.55,'#ffffff55'],[.78,'#ffffff88'],[1,'#52463c20']].forEach(([p,c])=>zipper.addColorStop(p,c));ctx.fillStyle=zipper;ctx.fillRect(156,176,770,19);
 for(const y of [179,188]){ctx.beginPath();ctx.moveTo(157,y);ctx.bezierCurveTo(390,y+1,704,y-1,925,y);ctx.strokeStyle='#ffffff75';ctx.lineWidth=1.3;ctx.stroke();}
 ctx.restore();
}

function draw(forExport=false){
 const shadowStyle=getComputedStyle(canvas);
 sockShadow={color:shadowStyle.getPropertyValue('--sock-shadow-color').trim()||'rgba(0, 0, 0, 0.22)',blur:parseFloat(shadowStyle.getPropertyValue('--sock-shadow-blur'))||0,x:parseFloat(shadowStyle.getPropertyValue('--sock-shadow-x'))||0,y:parseFloat(shadowStyle.getPropertyValue('--sock-shadow-y'))||0};
 ctx.clearRect(0,0,1080,1350);ctx.fillStyle=sceneColors.background;ctx.fillRect(0,0,1080,1350);
 ctx.save();
 if(showPackaging){
 ctx.clip(bagInterior);
 // Scale around the original sock composition center, then apply axis offsets.
 ctx.translate(570+bagSockTransform.x,720+bagSockTransform.y);
 ctx.scale(bagSockTransform.scale/100,bagSockTransform.scale/100);
 ctx.translate(-570,-720);ctx.translate(160,215);ctx.scale(.76,.76);
 }else{
 // Reserve the top logo and bottom editorial lockup on the unbagged poster.
 ctx.translate(150,155);ctx.scale(.72,.72);
 }
 sock(444,50,false);sock(512,138,true);ctx.restore();
 if(showPackaging) drawPackaging();else drawPosterBacking();
 canvas.closest('.preview-section').classList.toggle('poster-preview',!showPackaging);
 renderHtmlPackageText();
 if(forExport&&showPackaging)paintPackageHtml();
}
document.querySelector('#packaging').addEventListener('change',event=>{showPackaging=event.target.checked;draw();});
function makeSlider(text, id, value, min, max, update, isGap=false){
 const row=document.createElement('div');row.className=isGap?'stripe-slider gap-slider':'stripe-slider';
 const label=document.createElement('label');label.htmlFor=id;label.textContent=text;
 const output=document.createElement('output');output.htmlFor=id;output.value=String(value);
 const input=document.createElement('input');input.type='range';input.id=id;input.min=min;input.max=max;input.step=1;input.value=value;
 input.addEventListener('input',()=>{const next=Number(input.value);const actual=update(next)??next;input.value=actual;output.value=String(actual);draw();});
 row.append(label,output,input);return row;
}
function renderColors(){
 fitStripeHeight();
 const container=document.querySelector('#colors');container.replaceChildren();
 colors.forEach((color,index)=>{
 const card=document.createElement('div');card.className='stripe-card';container.append(card);
 const row=document.createElement('div');row.className='color-row';
 const label=document.createElement('span');label.textContent=`條紋 ${String(index+1).padStart(2,'0')}`;row.append(label);
 const input=document.createElement('input');input.type='color';input.className='custom-color';input.value=color;input.setAttribute('aria-label',`條紋 ${index+1} 自訂顏色`);
 const hex=document.createElement('code');hex.className='hex';hex.textContent=color;
 input.addEventListener('input',()=>{if(!setStripeColor(index,input.value.toUpperCase())){input.value=colors[index];return;}hex.textContent=colors[index];draw();});row.append(input,hex);card.append(row);
 card.append(makeSlider(`條紋 ${index+1} 粗細`, `width-${index}`, widths[index], 6, 48, value => setStripeDimension(widths,index,value)));
 if(index < colors.length-1) card.append(makeSlider(`條紋 ${index+1} 與 ${index+2} 間距`, `gap-${index}`, gaps[index], 0, 56, value => setStripeDimension(gaps,index,value), true));
 });
 document.querySelector('#count-output').value=colors.length;document.querySelector('#count').value=colors.length;
 document.querySelector('#minus').disabled=colors.length<=3;document.querySelector('#plus').disabled=colors.length>=12;
}
document.querySelector('#minus').addEventListener('click',()=>{if(colors.length>3){if(new Set(colors.slice(0,-1)).size<2){document.querySelector('#status').textContent='每雙襪子至少保留 2 色。';return;}colors.pop();widths.pop();gaps.pop();renderColors();draw();}});
document.querySelector('#plus').addEventListener('click',()=>{if(colors.length<12){colors.push(colors.at(-1));widths.push(widths.at(-1));gaps.push(10);renderColors();draw();}});
document.querySelector('#export').addEventListener('click',async()=>{
 const button=document.querySelector('#export'),status=document.querySelector('#status');
 button.disabled=true;status.textContent='正在製作 PNG…';
 try{
  await document.fonts.ready;
  moodState.note=wrapNote(document.querySelector('#mood-note').value);
  // Freeze the complete artwork before restoring the interactive preview.
  draw(true);
  const snapshot=document.createElement('canvas');snapshot.width=1080;snapshot.height=1350;
  snapshot.getContext('2d').drawImage(canvas,0,0);draw();
  const blob=await new Promise((resolve,reject)=>snapshot.toBlob(value=>value?resolve(value):reject(new Error('PNG unavailable')),'image/png'));
  const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`line-socks-${Date.now()}.png`;document.body.append(a);a.click();a.remove();
  setTimeout(()=>URL.revokeObjectURL(url),60000);status.textContent='PNG 已匯出 · 1080 × 1350 px';
 }catch(error){draw();status.textContent='匯出失敗，請再試一次。';}
 finally{button.disabled=false;}
});
renderColors();draw();

function wrapNote(value){
 ctx.save();ctx.font=`${(packageTextSizes[22]??14)}px "${packageFont}", Arial`;const lines=[];
 for(const paragraph of value.replace(/\r/g,'').split('\n')){let line='';for(const char of paragraph){if(ctx.measureText(line+char).width>184&&line){lines.push(line);line='';}line+=char;}lines.push(line);}
 ctx.restore();return lines;
}
const textChoices=[
 ['weather-choice',[['auto','自動取得'],['sunny','晴天'],['cloudy','多雲'],['rainy','雨天'],['windy','有風'],['stormy','雷雨']]],
 ['mood-choice',[['happy','開心'],['calm','平靜'],['tired','疲憊'],['sad','難過'],['anxious','焦慮'],['angry','生氣'],['lonely','孤單']]]
];
for(const [id,options] of textChoices){
 const group=document.querySelector('#'+id);group.replaceChildren();
 for(const [value,label] of options){
  const button=document.createElement('button');button.type='button';button.className='icon-option text-option';button.textContent=label;
  button.setAttribute('aria-pressed',String((id==='weather-choice'?weatherSelection:moodState.mood)===value));
  button.addEventListener('click',()=>{
   if(id==='weather-choice'){weatherSelection=value;if(value==='auto')refreshAutomaticWeather();}else moodState.mood=value;
   for(const sibling of group.children)sibling.setAttribute('aria-pressed',String(sibling===button));
   syncMoodScenario();draw();
  });group.append(button);
 }
}
let acceptedNote='';
document.querySelector('#mood-note').addEventListener('input',event=>{const lines=wrapNote(event.target.value);if(lines.length>3){event.target.value=acceptedNote;document.querySelector('#note-help').textContent='已達 3 行上限，請縮短文字後再輸入。';return;}noteEdited=true;acceptedNote=event.target.value;moodState.note=lines;document.querySelector('#note-help').textContent=`${lines.length} / 3 行 · 依包裝文字寬度自動換行`;draw();});
function refreshLocalTime(){syncMoodScenario();draw();}
refreshLocalTime();setInterval(()=>{refreshLocalTime();refreshAutomaticWeather();},60000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden){refreshLocalTime();refreshAutomaticWeather();}});

function buildDeveloperPanel(){
 const fontControls=document.querySelector('#package-font-controls');fontControls.replaceChildren();
 const iconControls=document.querySelector('#package-icon-controls');iconControls.replaceChildren();
 const add=(parent,label,value,min,max,change)=>{const row=document.createElement('label');row.className='developer-size-row';const title=document.createElement('span');title.textContent=label;const input=document.createElement('input');input.type='number';input.min=min;input.max=max;input.step=1;input.value=value;input.setAttribute('aria-label',label);const unit=document.createElement('span');unit.textContent='px';input.addEventListener('input',()=>{if(input.value===''||!input.validity.valid)return;change(Number(input.value));draw();});input.addEventListener('change',()=>{if(input.value===''||!input.validity.valid){input.value=value;change(value);draw();}});row.append(title,input,unit);parent.append(row);};
 const names={2:'右上標題：DAILY ESSENTIALS',3:'右上副標：FEEL TODAY IN YOUR OWN WAY',6:'年份數字',7:'月 / 日',8:'星期',14:'圖示標籤：TODAY WEATHER',15:'圖示標籤：DAY / NIGHT',16:'圖示標籤：MOOD STATUS',17:'圖示標籤：THOUGHT',18:'右側直式主標 ONE DAY ONE MOOD',19:'右側直式品名 Line Socks',20:'右側提示：TODAY FEELS LIKE...',22:'右側描述文字',25:'右下標語：ONE DAY ONE MOOD'};
 packageTextEntries.forEach((entry,key)=>add(fontControls,names[key]||entry.label,packageTextSizes[key]??entry.size,6,96,value=>{packageTextSizes[key]=value;}));
 ['當日天氣','天色','心情狀態','念頭'].forEach((label,i)=>{add(iconControls,label+'圖示',packageIconSizes[i],16,96,value=>{packageIconSizes[i]=value;});add(iconControls,label+'外圈直徑',packageRingSizes[i],32,120,value=>{packageRingSizes[i]=value;});});
}
document.querySelector('#developer-panel').addEventListener('toggle',event=>{if(event.target.open){buildDeveloperPanel();}});
document.querySelector('#reset-package-sizes').addEventListener('click',()=>{for(const key of Object.keys(packageTextSizes))delete packageTextSizes[key];packageIconSizes.fill(39);packageRingSizes.fill(68);draw();buildDeveloperPanel();});

document.querySelector('#package-font').addEventListener('change',async event=>{
 const family=event.target.value,select=event.target,status=document.querySelector('#font-status');select.disabled=true;document.querySelector('#export').disabled=true;status.textContent='字型載入中…';
 try{if(family!=='Arial'){
 if(family!=='Mallory')await new Promise((resolve,reject)=>{const link=document.createElement('link');link.rel='stylesheet';link.href='https://fonts.googleapis.com/css2?family='+encodeURIComponent(family)+':wght@400;700&display=swap';const timer=setTimeout(()=>reject(new Error('timeout')),12000);link.onload=()=>{clearTimeout(timer);resolve();};link.onerror=()=>{clearTimeout(timer);reject(new Error('font'));};document.head.append(link);});
 const loaded=await Promise.race([Promise.all([document.fonts.load(`400 16px "${family}"`),document.fonts.load(`700 16px "${family}"`)]),new Promise((_,reject)=>setTimeout(()=>reject(new Error('timeout')),12000))]);if(loaded.some(fonts=>!fonts.length))throw new Error('font');
 }packageFont=family;moodState.note=wrapNote(document.querySelector('#mood-note').value);status.textContent=family==='Arial'?'使用系統字型':family==='Mallory'?'Mallory 本機字型已載入':'Google Fonts 已載入';draw();
 }catch(error){select.value=packageFont;status.textContent=family==='Mallory'?'未找到 Mallory 本機字型，請先安裝字型，或提供字型檔以加入專案。已保留原字型。':'無法載入字型，保留原字型。請確認網路連線。';}finally{select.disabled=false;document.querySelector('#export').disabled=false;}
});

const sockAxisControls=[['bag-sock-scale','scale','%'],['bag-sock-x','x',' px'],['bag-sock-y','y',' px']];
for(const [id,key,unit] of sockAxisControls){const input=document.querySelector('#'+id);input.addEventListener('input',()=>{bagSockTransform[key]=Number(input.value);document.querySelector('#'+id+'-value').value=input.value+unit;draw();});}
document.querySelector('#reset-bag-socks').addEventListener('click',()=>{Object.assign(bagSockTransform,{scale:100,x:0,y:0});for(const [id,key,unit] of sockAxisControls){document.querySelector('#'+id).value=bagSockTransform[key];document.querySelector('#'+id+'-value').value=bagSockTransform[key]+unit;}draw();});

const scenePalettes=[
 ['background','預覽背景',['#a8a8a8','#F5F5F5','#D6D3CC','#202020','#C4D6DD','#E8CFD3']],
 ['bag','夾鍊袋',['#FFFFFF','#C8D9EA','#E9CAD6','#D6DFC3','#D9C9B9','#666666']],
 ['ink','夾鍊袋文字',['#202020','#FFFFFF','#F16625','#283E63','#7B3042','#34624C']]
];
for(const [key,label,palette] of scenePalettes){
 const field=document.createElement('fieldset');field.className='scene-color-field';const legend=document.createElement('legend');legend.textContent=label;field.append(legend);
 const row=document.createElement('div');row.className='scene-color-row';const swatches=document.createElement('div');swatches.className='swatches';
 const picker=document.createElement('input');picker.type='color';picker.className='custom-color';picker.value=sceneColors[key];picker.setAttribute('aria-label',label+'自訂顏色');
 const update=value=>{sceneColors[key]=value.toUpperCase();draw();};
 picker.addEventListener('input',()=>update(picker.value));row.append(picker);field.append(row);document.querySelector('#scene-color-controls').append(field);
}

function renderHtmlPackageText(){
 packageTextLayer.hidden=!showPackaging;
 packageTextLayer.style.zoom=String(canvas.getBoundingClientRect().width/1080);
 document.documentElement.style.setProperty('--package-font',`"${packageFont}", Arial, sans-serif`);
 packageTextLayer.style.setProperty('--package-font',`"${packageFont}", Arial, sans-serif`);
 packageTextLayer.style.color=sceneColors.ink;
 const now=new Date();
 const weatherNames={sunny:'SUNNY',partly_cloudy:'PARTLY CLOUDY',cloudy:'CLOUDY',rainy:'RAINY',fog:'FOG',snow:'SNOW',storm:'STORM',wind:'WINDY',unknown:'WEATHER UNAVAILABLE'};
 const values={year:String(now.getFullYear()),month:String(now.getMonth()+1).padStart(2,'0'),date:String(now.getDate()).padStart(2,'0'),weekday:['SUN','MON','TUE','WED','THU','FRI','SAT'][now.getDay()],weather:weatherNames[selectedWeatherIcon()]||weatherNames.unknown,day:scenarioTime(now).toUpperCase(),mood:moodState.mood.toUpperCase(),activity:moodState.activityLabel};
 const descriptionSize=packageTextSizes[22]??14;
 packageTextLayer.querySelector('.package-note-lines').style.setProperty('--note-leading',(descriptionSize*1.2+19)+'px');
 values.note=wrapNote(document.querySelector('#mood-note')?.value||'').slice(0,3).join('\n');
 for(const element of packageTextLayer.querySelectorAll('[data-dynamic]'))element.textContent=values[element.dataset.dynamic]||'';
 for(const element of packageTextLayer.querySelectorAll('[data-text-key]')){
  const key=Number(element.dataset.textKey),size=Number(element.dataset.size);
  if(!element.dataset.sizeSource&&!packageTextEntries[key])packageTextEntries[key]={label:key===28?'日期分隔符 /':element.textContent||element.dataset.dynamic,size};
  const sizeKey=element.dataset.sizeSource?Number(element.dataset.sizeSource):key;
  element.style.fontSize=(packageTextSizes[sizeKey]??size)+'px';
 }
 const keys=[selectedWeatherIcon(),scenarioTime(now)==='evening'?'sunset':automaticDayIcon(now),moodState.mood,moodState.thought];
 for(const item of packageTextLayer.querySelectorAll('[data-status-index]')){
  const i=Number(item.dataset.statusIndex),size=packageIconSizes[i],ring=packageRingSizes[i],extent=Math.max(size,ring)+4;
  const svg=item.querySelector('.package-status-icon'),circle=svg.querySelector('circle'),inner=svg.querySelector('svg');
  svg.setAttribute('viewBox',`0 0 ${extent} ${extent}`);svg.setAttribute('width',extent);svg.setAttribute('height',extent);svg.dataset.icon=keys[i];
  circle.setAttribute('cx',extent/2);circle.setAttribute('cy',extent/2);circle.setAttribute('r',ring/2);
  inner.setAttribute('x',(extent-size)/2);inner.setAttribute('y',(extent-size)/2);inner.setAttribute('width',size);inner.setAttribute('height',size);inner.querySelector('path').setAttribute('d',iconPaths[keys[i]]);
 }
}

// Export the actual HTML line boxes, including wrapping and CSS spacing.
function paintPackageHtml(){
 // Measure a full-size print surface, independent of mobile CSS zoom and rounding.
 const printLayer=packageTextLayer.cloneNode(true);printLayer.removeAttribute('id');
 printLayer.hidden=false;printLayer.setAttribute('aria-hidden','true');
 Object.assign(printLayer.style,{zoom:'1',position:'fixed',left:'-12000px',top:'0',visibility:'hidden',width:'1080px',height:'1350px'});
 document.body.append(printLayer);
 try{
 const reference=printLayer.getBoundingClientRect(),ratio=1080/reference.width;
 const box=element=>{const r=element.getBoundingClientRect();return {x:(r.left-reference.left)*ratio,y:(r.top-reference.top)*ratio,width:r.width*ratio,height:r.height*ratio};};
 ctx.save();ctx.beginPath();ctx.rect(0,0,1080,1350);ctx.clip();
 for(const element of printLayer.querySelectorAll('[data-text-key]')){
  if(!element.textContent)continue;
  const style=getComputedStyle(element),size=parseFloat(style.fontSize),lineHeight=parseFloat(style.lineHeight)||size*1.2;
  ctx.font=`${style.fontWeight} ${size}px ${style.fontFamily}`;ctx.fillStyle=style.color;ctx.textAlign='left';
  const metrics=ctx.measureText('Mg'),ascent=metrics.fontBoundingBoxAscent??size*.8,descent=metrics.fontBoundingBoxDescent??size*.2;
  if(style.writingMode==='vertical-rl'){
   const r=box(element);ctx.save();ctx.translate(r.x+r.width-(lineHeight-ascent-descent)/2-descent,r.y);ctx.rotate(Math.PI/2);ctx.fillText(element.textContent,0,0);ctx.restore();continue;
  }
  const node=element.firstChild;if(!node)continue;
  const range=document.createRange(),lines=[];
  for(let i=0;i<node.textContent.length;i++){
   if(node.textContent[i]==='\n')continue;
   range.setStart(node,i);range.setEnd(node,i+1);const rect=range.getBoundingClientRect();
   const y=(rect.top-reference.top)*ratio,x=(rect.left-reference.left)*ratio;
   let line=lines[lines.length-1];if(!line||Math.abs(line.y-y)>1){line={x,y,height:rect.height*ratio,text:''};lines.push(line);}
   line.text+=node.textContent[i];
  }
  for(const line of lines)ctx.fillText(line.text,line.x,line.y+(line.height-ascent-descent)/2+ascent);
 }
 for(const element of printLayer.querySelectorAll('.package-rule')){
  const r=box(element);ctx.fillStyle=sceneColors.ink;ctx.fillRect(r.x,r.y,r.width,Math.max(1,r.height));
 }
 for(const element of printLayer.querySelectorAll('.package-status-icon')){
  const r=box(element),i=Number(element.parentElement.dataset.statusIndex);
  ctx.strokeStyle=sceneColors.ink;ctx.lineWidth=2;ctx.beginPath();ctx.arc(r.x+r.width/2,r.y+r.height/2,packageRingSizes[i]/2,0,Math.PI*2);ctx.stroke();drawIcon(element.dataset.icon,r.x+r.width/2,r.y+r.height/2,packageIconSizes[i]);
 }
 ctx.restore();
 }finally{printLayer.remove();}
}

new ResizeObserver(()=>{packageTextLayer.style.zoom=String(canvas.getBoundingClientRect().width/1080);}).observe(canvas);

function syncSockAxes(){for(const [id,key,unit] of sockAxisControls){document.querySelector('#'+id).value=bagSockTransform[key];document.querySelector('#'+id+'-value').value=bagSockTransform[key]+unit;}}
let sockDrag=null;
canvas.addEventListener('pointerdown',event=>{
 if(!showPackaging||event.button!==0||event.pointerType==='touch')return;
 const rect=canvas.getBoundingClientRect(),x=(event.clientX-rect.left)*1080/rect.width,y=(event.clientY-rect.top)*1350/rect.height;
 if(x<154||x>926||y<205||y>1290)return;
 sockDrag={id:event.pointerId,x:event.clientX,y:event.clientY,startX:bagSockTransform.x,startY:bagSockTransform.y,ratio:1080/rect.width};canvas.setPointerCapture(event.pointerId);canvas.classList.add('dragging-socks');event.preventDefault();
});
canvas.addEventListener('pointermove',event=>{if(!sockDrag||event.pointerId!==sockDrag.id)return;bagSockTransform.x=Math.max(-600,Math.min(600,Math.round(sockDrag.startX+(event.clientX-sockDrag.x)*sockDrag.ratio)));bagSockTransform.y=Math.max(-800,Math.min(800,Math.round(sockDrag.startY+(event.clientY-sockDrag.y)*sockDrag.ratio)));syncSockAxes();draw();});
const stopSockDrag=()=>{sockDrag=null;canvas.classList.remove('dragging-socks');};
canvas.addEventListener('pointerup',stopSockDrag);canvas.addEventListener('pointercancel',stopSockDrag);canvas.addEventListener('lostpointercapture',stopSockDrag);

// A JSON data block inside the HTML is the portable source for developer defaults.
const savedBlock=document.querySelector('#saved-developer-settings');
if(savedBlock){try{
 const saved=JSON.parse(savedBlock.textContent);
 const bounded=(v,min,max,fallback)=>Number.isFinite(v)?Math.max(min,Math.min(max,v)):fallback;
 for(const [key,value] of Object.entries(saved.textSizes||{}))if(/^\d+$/.test(key))packageTextSizes[key]=bounded(value,6,96,16);
 for(let i=0;i<4;i++){packageIconSizes[i]=bounded(saved.iconSizes?.[i],16,96,39);packageRingSizes[i]=bounded(saved.ringSizes?.[i],32,120,68);}
 bagSockTransform.scale=bounded(saved.socks?.scale,25,400,100);bagSockTransform.x=bounded(saved.socks?.x,-600,600,0);bagSockTransform.y=bounded(saved.socks?.y,-800,800,0);syncSockAxes();draw();
 const fontSelect=document.querySelector('#package-font');if([...fontSelect.options].some(option=>option.value===saved.font)){fontSelect.value=saved.font;fontSelect.dispatchEvent(new Event('change'));}
}catch(error){document.querySelector('#save-html-status').textContent='已儲存設定無法讀取，使用預設值。';}}

document.querySelector('#save-html-settings').addEventListener('click',async()=>{
 const status=document.querySelector('#save-html-status');
 const settings={version:1,textSizes:packageTextSizes,iconSizes:packageIconSizes,ringSizes:packageRingSizes,font:packageFont,socks:bagSockTransform};
 const clone=document.documentElement.cloneNode(true);
 // Remove generated UI; app.js rebuilds it when the saved HTML opens.
 for(const id of ['package-font-controls','package-icon-controls','colors','presets','mood-choice','weather-choice','thought-choice','scene-color-controls'])clone.querySelector('#'+id)?.replaceChildren();
 clone.querySelector('#package-text-layer')?.removeAttribute('style');
 clone.querySelector('#saved-developer-settings')?.remove();
 const data=document.createElement('script');data.id='saved-developer-settings';data.type='application/json';data.textContent=JSON.stringify(settings,null,2).replace(/</g,'\\u003c');clone.querySelector('head').append(data);
 clone.querySelector('#developer-panel').removeAttribute('open');clone.querySelector('#save-html-status').textContent='';
 const html='<!doctype html>\n'+clone.outerHTML;
 try{
 if(window.showSaveFilePicker){const handle=await window.showSaveFilePicker({suggestedName:'index.html',types:[{description:'HTML',accept:{'text/html':['.html']}}]});const writable=await handle.createWritable();await writable.write(html);await writable.close();status.textContent='設定已寫入並儲存至 HTML。';}
 else{const url=URL.createObjectURL(new Blob([html],{type:'text/html;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='index.html';link.click();setTimeout(()=>URL.revokeObjectURL(url),60000);status.textContent='已下載含設定的 HTML，請放回專案資料夾，與 app.js、style.css 放在一起。';}
 }catch(error){status.textContent=error.name==='AbortError'?'已取消儲存。':'儲存失敗，請重新嘗試。';}
});
refreshAutomaticWeather();

// Scenario prose stays in JSON; the active result only changes with its inputs.
function scenarioTime(now=new Date()){
 const hour=now.getHours();return hour<SCENARIO_TIME.day||hour>=SCENARIO_TIME.night?'night':hour>=SCENARIO_TIME.evening?'evening':'day';
}
function scenarioWeather(){
 return {sunny:'sunny',partly_cloudy:'cloudy',cloudy:'cloudy',fog:'cloudy',rainy:'rainy',snow:'rainy',storm:'stormy',wind:'windy'}[selectedWeatherIcon()]||'unknown';
}
function randomPick(array){return array?.length?array[Math.floor(Math.random()*array.length)]:null;}
function getMoodScenario(mood,weather,timeOfDay){
 return scenarioData?.scenarios.find(row=>row.mood===mood&&row.weather===weather&&row.timeOfDay===timeOfDay)||null;
}
function validateScenarios(data){
 if(data?.scenarios?.length!==105)throw new Error('情境數量必須為 105 組');
 const keys=new Set();
 for(const row of data.scenarios){
  const key=[row.mood,row.weather,row.timeOfDay].join('/');
  if(keys.has(key)||typeof row.thought!=='string'||!row.activityOptions?.length||row.activityOptions.some(id=>!data.actionCatalog?.[id]||!iconPaths[data.actionCatalog[id].lucideIcon]))throw new Error('情境重複或活動資料不完整');
  keys.add(key);
 }
 for(const mood of ['happy','calm','tired','sad','anxious','angry','lonely'])for(const weather of ['sunny','cloudy','rainy','windy','stormy'])for(const time of ['day','evening','night'])if(!keys.has([mood,weather,time].join('/')))throw new Error('情境組合缺漏');
 return data;
}
function applyScenarioThought(){
 if(!currentScenario)return;
 acceptedNote=currentScenario.thought;noteEdited=false;
 document.querySelector('#mood-note').value=acceptedNote;moodState.note=wrapNote(acceptedNote);
 document.querySelector('#note-help').textContent='已帶入情境文字，可自由編輯。';
}
function syncMoodScenario(force=false){
 if(!scenarioData)return;
 const weather=scenarioWeather(),time=scenarioTime(),key=[moodState.mood,weather,time].join('/');
 if(!force&&key===scenarioKey)return;scenarioKey=key;
 currentScenario=getMoodScenario(moodState.mood,weather,time);
 const actionKey=randomPick(currentScenario?.activityOptions),action=scenarioData.actionCatalog[actionKey];
 currentActivity=actionKey;
 moodState.thought=action?.lucideIcon||'unknown';moodState.activityLabel=action?(activityEnglishLabels[actionKey]||actionKey.replace(/_/g,' ').toUpperCase()):'ACTIVITY UNAVAILABLE';
 const output=document.querySelector('#activity-result');output.replaceChildren();
 const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('viewBox','0 0 24 24');svg.setAttribute('aria-hidden','true');
 const path=document.createElementNS(svg.namespaceURI,'path');path.setAttribute('d',iconPaths[moodState.thought]);svg.append(path);
 const label=document.createElement('span');label.textContent=action?.label||'等待天氣資料';output.append(svg,label);
 document.querySelector('#scenario-status').textContent=currentScenario?'依心情、天氣與時段自動建議活動。':'未取得可用天氣，暫不產生活動與情境文字。';
 document.querySelector('#regenerate-activity').disabled=!currentScenario;document.querySelector('#apply-thought').disabled=!currentScenario;
 if(!noteEdited){if(currentScenario)applyScenarioThought();else {acceptedNote='';moodState.note=[];document.querySelector('#mood-note').value='';}}
 document.querySelector('#generate-stripes').disabled=!currentScenario;
 if(!currentScenario)document.querySelector('#presets').replaceChildren();
 if(currentScenario)generateScenarioStripes();
}
function acceptScenarioData(data){
 scenarioData=validateScenarios(data);scenarioKey='';syncMoodScenario();draw();
 document.querySelector('#scenario-file-field').hidden=true;
 try{localStorage.setItem('line-socks-scenarios-v1',JSON.stringify(data));}catch{}
}
async function loadScenarioData(){
 try{const response=await fetch('./line-mood-socks-scenarios.json');if(!response.ok)throw new Error('JSON unavailable');acceptScenarioData(await response.json());}
 catch{
  try{const cached=JSON.parse(localStorage.getItem('line-socks-scenarios-v1'));if(cached){acceptScenarioData(cached);return;}}catch{}
  document.querySelector('#scenario-status').textContent='瀏覽器未能讀取情境檔，請選取同資料夾的 JSON 載入。';document.querySelector('#scenario-file-field').hidden=false;
 }
}
document.querySelector('#scenario-file').addEventListener('change',async event=>{
 const file=event.target.files[0];if(!file)return;
 try{acceptScenarioData(JSON.parse(await file.text()));}catch(error){document.querySelector('#scenario-status').textContent='載入失敗：'+error.message;}
 event.target.value='';
});
document.querySelector('#regenerate-activity').addEventListener('click',()=>{syncMoodScenario(true);draw();});
document.querySelector('#apply-thought').addEventListener('click',()=>{applyScenarioThought();draw();});
window.testMoodScenarios=()=>{validateScenarios(scenarioData);return [['happy','sunny','day'],['sad','rainy','evening'],['lonely','stormy','night']].map(args=>getMoodScenario(...args));};
loadScenarioData();


// Stable properties depend only on the five scenario inputs. Only stripeOrder is shuffled.
function stripeSeed(text){let hash=2166136261;for(const char of text){hash^=char.codePointAt(0);hash=Math.imul(hash,16777619);}return hash>>>0;}
function stripeRandom(seed){return ()=>{seed+=0x6D2B79F5;let t=seed;t=Math.imul(t^(t>>>15),t|1);t^=t+Math.imul(t^(t>>>7),t|61);return ((t^(t>>>14))>>>0)/4294967296;};}
function buildStripeDesign({mood,weather,timeOfDay,thought,activity,seed=''}){
 const rng=stripeRandom(stripeSeed(JSON.stringify([mood,weather,timeOfDay,thought,activity,seed])));
 const pick=(lo,hi)=>lo+Math.floor(rng()*(hi-lo+1));
 // Mood sets density; reserve budget for bold bands and deliberate open spaces.
 const profiles={happy:[7,10,190],calm:[5,7,175],tired:[4,6,170],sad:[5,7,180],anxious:[9,12,200],angry:[6,9,190],lonely:[4,6,180]};
 const [lo,hi,target]=profiles[mood]||profiles.calm;
 const stripeCount=pick(lo,hi),colorCount=Math.min(stripeCount,pick(5,6));
 const hue={sunny:35,cloudy:195,rainy:225,windy:140,stormy:275}[weather]??195;
 const activitySeed=stripeSeed(activity||'');
 // Multiple harmony families, rather than a run of adjacent hues.
 const harmonies=[[0,150,210,55,285,100],[0,120,240,30,180,300],[0,180,70,250,140,320],[0,90,200,300,45,155]];
 const offsets=harmonies[pick(0,harmonies.length-1)],shift=pick(-22,22);
 const dayShift={day:5,evening:-3,night:-12}[timeOfDay]??0;
 const levels=[42,72,27,59,83,48];
 function hslHex(h,s,l){s/=100;l/=100;const a=s*Math.min(l,1-l),f=n=>{const k=(n+h/30)%12;return Math.round(255*(l-a*Math.max(-1,Math.min(k-3,9-k,1)))).toString(16).padStart(2,'0');};return '#'+f(0)+f(8)+f(4);}
 const palette=Array.from({length:colorCount},(_,i)=>hslHex((hue+shift+offsets[i]+(i===colorCount-1?activitySeed%65:0)+360)%360,i===colorCount-2?pick(12,28):pick(55,90),levels[i]+dayShift));
 const stripeWidths=Array(stripeCount).fill(6),stripeGaps=Array(stripeCount-1).fill(0);
 const bold=activitySeed%stripeCount,open=(activitySeed>>>4)%(stripeCount-1);
 stripeWidths[bold]=pick(36,48);stripeGaps[open]=pick(30,48);
 let budget=Math.min(200,target+pick(-8,8))-stripeWidths.reduce((a,b)=>a+b,0)-stripeGaps.reduce((a,b)=>a+b,0);
 // Keep a hairline and a tight gap; allocate remaining space in uneven clusters.
 const thin=(bold+1)%stripeCount,tight=(open+1)%(stripeCount-1);
 while(budget>0){
  const isGap=rng()<.28,arr=isGap?stripeGaps:stripeWidths,i=pick(0,arr.length-1);
  if(i===(isGap?tight:thin))continue;
  const cap=isGap?56:48,amount=Math.min(budget,pick(1,12),cap-arr[i]);
  if(amount<=0)continue;arr[i]+=amount;budget-=amount;
 }
 // Activity determines the repeated color rhythm, including accent frequency.
 const rhythm=2+activitySeed%4;
 const stripeOrder=Array.from({length:stripeCount},(_,i)=>i<colorCount?i:(i%rhythm===0?colorCount-1:i%(colorCount-1)));
 return {stripeCount,stripeWidths,stripeGaps,palette,colorCount,stripeOrder};
}
function shuffleStripeOrder(order,random=Math.random){
 const result=[...order];for(let i=result.length-1;i>0;i--){const j=Math.floor(random()*(i+1));[result[i],result[j]]=[result[j],result[i]];}
 if(result.every((v,i)=>v===order[i]))result.push(result.shift());return result;
}
function generateScenarioStripes(){
 if(!currentScenario||!currentActivity)return;
 const thought=document.querySelector('#mood-note').value;
 const design=buildStripeDesign({mood:currentScenario.mood,weather:currentScenario.weather,timeOfDay:currentScenario.timeOfDay,thought,activity:currentActivity,seed:visitSeed});
 const inputKey=JSON.stringify([currentScenario.mood,currentScenario.weather,currentScenario.timeOfDay,thought,currentActivity]);
 if(inputKey!==paletteScenarioKey){paletteChoice=0;paletteScenarioKey=inputKey;}
 const options=scenarioPalettes(design.palette);
 design.palette=options[paletteChoice];
 renderScenarioPalettes(options);
 const previous=currentStripeDesign&&JSON.stringify({...currentStripeDesign,stripeOrder:[]})===JSON.stringify({...design,stripeOrder:[]})?currentStripeDesign.stripeOrder:design.stripeOrder;
 design.stripeOrder=shuffleStripeOrder(previous);currentStripeDesign=design;
 colors=design.stripeOrder.map(i=>design.palette[i]);widths=[...design.stripeWidths];gaps=[...design.stripeGaps];renderColors();
}
function setStripeColor(index,color){
 const next=[...colors];next[index]=color;const count=new Set(next.map(c=>c.toLowerCase())).size;
 if(count<2||count>6){document.querySelector('#status').textContent='每雙襪子的條紋需保留 2～6 色。';return false;}
 colors=next;return true;
}
document.querySelector('#generate-stripes').addEventListener('click',()=>{generateScenarioStripes();draw();});

function stripeHeight(){return widths.reduce((a,b)=>a+b,0)+gaps.reduce((a,b)=>a+b,0);}
function setStripeDimension(array,index,value){
 const available=200-stripeHeight()+array[index];array[index]=Math.min(value,available);
 return array[index];
}
function fitStripeHeight(){
 // Also enforce the cap after manual count changes, presets and reset.
 let excess=stripeHeight()-200;
 for(const [array,min] of [[gaps,0],[widths,6]])for(let i=array.length-1;i>=0&&excess>0;i--){const delta=Math.min(excess,array[i]-min);array[i]-=delta;excess-=delta;}
}

// Three deterministic color directions share the same stripe geometry and color count.
function scenarioPalettes(base){
 function rotate(hex,degrees){
  const rgb=hex.slice(1).match(/../g).map(c=>parseInt(c,16)/255),max=Math.max(...rgb),min=Math.min(...rgb),delta=max-min;
  let hue=delta===0?0:max===rgb[0]?((rgb[1]-rgb[2])/delta)%6:max===rgb[1]?(rgb[2]-rgb[0])/delta+2:(rgb[0]-rgb[1])/delta+4;
  hue=((hue*60+degrees)%360+360)%360;
  const x=delta*(1-Math.abs((hue/60)%2-1));
  const channels=hue<60?[delta,x,0]:hue<120?[x,delta,0]:hue<180?[0,delta,x]:hue<240?[0,x,delta]:hue<300?[x,0,delta]:[delta,0,x];
  return '#'+channels.map(c=>Math.round((c+min)*255).toString(16).padStart(2,'0')).join('');
 }
 return [base,[...base].map(c=>rotate(c,55)),[...base].map(c=>rotate(c,165))];
}
function renderScenarioPalettes(options){
 const group=document.querySelector('#presets');group.replaceChildren();
 options.forEach((option,index)=>{
  const button=document.createElement('button');button.type='button';button.className='preset';button.setAttribute('aria-label',`情境配色 ${index+1}，${option.length} 色`);button.setAttribute('aria-pressed',String(index===paletteChoice));
  const marker=document.createElement('span');marker.className='palette-marker';marker.setAttribute('aria-hidden','true');button.append(marker);
  option.forEach(color=>{const dot=document.createElement('i');dot.style.background=color;button.append(dot);});
  button.addEventListener('click',()=>{
   paletteChoice=index;
   if(!currentStripeDesign)return;
   currentStripeDesign.palette=[...option];
   colors=currentStripeDesign.stripeOrder.map(i=>option[i]);
   widths=[...currentStripeDesign.stripeWidths];gaps=[...currentStripeDesign.stripeGaps];
   renderScenarioPalettes(options);renderColors();draw();
  });group.append(button);
 });
}

for(const input of document.querySelectorAll('input[name="sock-base"]')){
 input.addEventListener('change',()=>{if(input.checked){sockBase=input.value;draw();}});
}

function drawPosterBacking(){
 ctx.save();ctx.fillStyle=sceneColors.ink;
 // The reference uses the original upright logo, not the rotated sole mark.
 ctx.translate(64,64);ctx.scale(104/146,104/146);
 for(const part of soleLogo)ctx.fill(part.path,part.rule);
 ctx.restore();
 ctx.save();ctx.fillStyle=sceneColors.ink;ctx.textAlign='center';ctx.textBaseline='alphabetic';
 const family=`"${packageFont}", Arial, sans-serif`;
 ctx.font=`900 80px ${family}`;
 const title='ONE DAY ONE MOOD';
 const size=Math.min(80,80*952/ctx.measureText(title).width);
 ctx.font=`900 ${size}px ${family}`;ctx.fillText(title,540,1176);
 ctx.font=`400 32px ${family}`;ctx.fillText('GOOD SOCKS',540,1235);
 ctx.font=`400 22px ${family}`;ctx.fillText('WALK WITH YOU THROUGH EVERY STEP',540,1273);
 ctx.restore();
}
