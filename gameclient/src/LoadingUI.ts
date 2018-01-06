//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class LoadingUI extends egret.Sprite {

    public constructor() {
        super();
        this.createView();
    }

    private progress : egret.Bitmap;

    private createView():void {
        let bg = DisplayUtil.sprite("loadingBg_jpg")
        this.addChild(bg);
        
        let tipsBg = DisplayUtil.sprite("tips_png");
        this.addChild(tipsBg);
        tipsBg.x = DisplayUtil.stageWidth/2 - tipsBg.width/2;
        tipsBg.y = 870;

        let tips = new egret.TextField();
        tips.textAlign = "center";
        tips.text = "碰到炸弹会被定身";
        tips.bold = true
        tips.x = DisplayUtil.stageWidth/2 - tips.width/2;
        tips.y = tipsBg.y + tipsBg.height/2 - tips.height/2;
        this.addChild(tips);

        let progressBg = DisplayUtil.sprite("loading_a_png");
        this.addChild(progressBg);
        progressBg.x = DisplayUtil.stageWidth/2 - progressBg.width/2;
        progressBg.y = 700;

        let progress = DisplayUtil.sprite9("loading_b_png", new egret.Rectangle(60, 20, 203, 10));
        progress.width = 360;
        progress.height = 50
        this.addChild(progress);
        progress.x = DisplayUtil.stageWidth/2 - progress.width/2;
        progress.y = progressBg.y + progressBg.height/2 - progress.height/2;
        this.progress = progress;

        let tips2 = DisplayUtil.labelOutLine("就快要变为土豪了")
        tips2.textAlign = "center";
        tips2.x = DisplayUtil.stageWidth/2 - tips2.width/2;
        tips2.y = progressBg.y + progressBg.height/2 - tips2.height/2;
        tips2.bold = true
        this.addChild(tips2);

    }

    public setProgress(current:number, total:number):void {
        this.progress.width = 360 * current / total;
    }
}
