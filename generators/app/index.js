#!/usr/bin/env node

const Generator = require("yeoman-generator");
const fs = require("fs");
const path = require("path");

module.exports = class extends Generator {
  async prompting() {
    const answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your Project Name",
        default: this.appname,
      },
      {
        type: "input",
        name: "description",
        message: "Descript your project",
        default: "",
      },
    ]);
    console.log(answers);
  }

  writing() {
    // __dirname 为本文件的 绝对路径
    const templatePath = path.join(__dirname, "templates");
    const destPath = process.cwd();
    const getAllFilePaths = (curPath, prevAllPaths) => {
      // 获取当前目录的所有文件的 相对路径（只有文件名）
      let fileNames = fs.readdirSync(curPath);
      let allPaths = prevAllPaths || [];

      fileNames.forEach((file) => {
        const fileAbsPath = path.join(curPath, file);

        if (fs.statSync(fileAbsPath).isDirectory()) {
          allPaths = getAllFilePaths(fileAbsPath, allPaths);
        } else {
          allPaths.push(path.join(fileAbsPath));
        }
      });

      return allPaths;
    };

    const filePaths = getAllFilePaths(templatePath);

    filePaths.forEach((filePath) => {
      this.fs.copyTpl(
        this.templatePath(filePath),
        this.destinationPath(
          path.join(destPath, filePath.replace(templatePath + "/", ""))
        )
      );
    });
  }
};
