import * as path from 'path';
import * as fs from 'fs'

let distDir = 'dist';
let targetProjectDir = '../WebDemo';
let distDirInTarget = 'Scripts/NGApp';
let mvcIndexFile = 'views/home/index.cshtml';
let targetDir = path.join(targetProjectDir, distDirInTarget);
try {
  if (fs.existsSync(targetDir)) {
    //delete existing files in target dir
    fs.readdirSync(targetDir).forEach(f =>fs.unlinkSync(path.join(targetDir, f)));
  } else {
    //create target dir
    fs.mkdirSync(targetDir);
  }
  //copy files to target dir
  fs.readdirSync(distDir).forEach(f => {
    copyFile(path.join(distDir, f), path.join(targetDir, f));
  });
  //create index.cshtml
  fs.writeFileSync(
    path.join(targetProjectDir, mvcIndexFile),
    `@{
      Layout = null;
  }
  <base href="/${distDirInTarget}/">` +
    fs.readFileSync('dist/index.html').toString());
  console.log("DONE!!!!!")
}
catch (error) {
  console.log(error);
  throw error;
}





function copyFile(source: string, target: string) {
  fs.createReadStream(source).pipe(fs.createWriteStream(target));

}
