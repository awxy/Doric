/*
 * Copyright [2019] [Doric.Pub]
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
//
//  DoricShowNodeTreeViewController.m
//  Doric
//
//  Created by jingpeng.wang on 2021/7/8.
//
#import "DoricShowNodeTreeViewController.h"
#import "DoricShowNodeTreeViewCell.h"

#import "RATreeView.h"
#import <DoricCore/DoricContextManager.h>
#import <DoricCore/DoricContext.h>
#import <DoricCore/DoricGroupNode.h>

@interface DoricShowNodeTreeViewController () <RATreeViewDelegate, RATreeViewDataSource>
@property(nonatomic, weak) DoricContext *doricContext;
@property(nonatomic, weak) NSString *collapse;
@property(nonatomic, weak) NSString *expand;
@end

@implementation DoricShowNodeTreeViewController

- (void)viewDidLoad {
    [super viewDidLoad];
    
    self.collapse = @"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";
    self.expand =  @"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";
    
    self.doricContext = [[DoricContextManager instance] getContext:self.contextId];
    
    RATreeView *treeView = [[RATreeView alloc] initWithFrame:self.view.bounds];
    [self.view addSubview:treeView];
    
    treeView.delegate = self;
    treeView.dataSource = self;
    [treeView registerClass:DoricShowNodeTreeViewCell.self forCellReuseIdentifier:@"cell"];
    [treeView reloadData];
}


#pragma mark ratreeview delegate

- (nonnull UITableViewCell *)treeView:(nonnull RATreeView *)treeView cellForItem:(nullable id)item {
    DoricShowNodeTreeViewCell *cell = [treeView dequeueReusableCellWithIdentifier:@"cell"];
    cell.nodeNameLabel.text = [item description];
    [cell.nodeNameLabel sizeToFit];
    
    if ([item isKindOfClass:[DoricGroupNode class]]) {
        NSData *imageData = [[NSData alloc] initWithBase64EncodedString:self.collapse
                                                                options:NSDataBase64DecodingIgnoreUnknownCharacters];
        cell.nodeIcon.image = [UIImage imageWithData:imageData];
    } else {
        cell.nodeIcon.image = nil;
    }
    
    NSInteger indent = [treeView levelForCellForItem:item];
    cell.nodeIcon.left = indent * 30;
    cell.nodeNameLabel.left = 30 + indent * 30;
    return cell;
}

- (nonnull id)treeView:(nonnull RATreeView *)treeView child:(NSInteger)index ofItem:(nullable id)item {
    if (item == nil) {
        return self.doricContext.rootNode;
    } else {
        DoricGroupNode *groupNode = item;
        return groupNode.childNodes[index];
    }
}

- (NSInteger)treeView:(nonnull RATreeView *)treeView numberOfChildrenOfItem:(nullable id)item {
    if (item == nil) {
        return 1;
    } else if ([item isKindOfClass:[DoricGroupNode class]]) {
        DoricGroupNode *groupNode = item;
        return groupNode.childNodes.count;
    }
    return 0;
}

- (CGFloat)treeView:(RATreeView *)treeView heightForRowForItem:(id)item {
    return 50;
}

- (void)treeView:(RATreeView *)treeView willExpandRowForItem:(id)item {
    if ([item isKindOfClass:[DoricGroupNode class]]) {
        DoricShowNodeTreeViewCell *cell = (DoricShowNodeTreeViewCell *)[treeView cellForItem:item];
        
        NSData *imageData = [[NSData alloc] initWithBase64EncodedString:self.expand
                                                                options:NSDataBase64DecodingIgnoreUnknownCharacters];
        cell.nodeIcon.image = [UIImage imageWithData:imageData];
    }
}

- (void)treeView:(RATreeView *)treeView willCollapseRowForItem:(id)item {
    if ([item isKindOfClass:[DoricGroupNode class]]) {
        DoricShowNodeTreeViewCell *cell = (DoricShowNodeTreeViewCell *)[treeView cellForItem:item];
        NSData *imageData = [[NSData alloc] initWithBase64EncodedString:self.collapse
                                                                options:NSDataBase64DecodingIgnoreUnknownCharacters];
        cell.nodeIcon.image = [UIImage imageWithData:imageData];
    }
}
@end