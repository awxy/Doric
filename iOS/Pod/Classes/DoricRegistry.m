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
//  DoricRegistry.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/27.
//

#import "DoricRegistry.h"
#import "DoricModalPlugin.h"
#import "DoricShaderPlugin.h"
#import "DoricStackNode.h"
#import "DoricVLayoutNode.h"
#import "DoricHLayoutNode.h"
#import "DoricTextNode.h"
#import "DoricImageNode.h"

@interface DoricRegistry ()

@property(nonatomic, strong) NSMutableDictionary *bundles;
@property(nonatomic, strong) NSMutableDictionary *plugins;
@property(nonatomic, strong) NSMutableDictionary *nodes;

@end

@implementation DoricRegistry

- (instancetype)init {
    if (self = [super init]) {
        _bundles = [[NSMutableDictionary alloc] init];
        _plugins = [[NSMutableDictionary alloc] init];
        _nodes = [[NSMutableDictionary alloc] init];
        [self innerRegister];
    }
    return self;
}

- (void)innerRegister {
    [self registerNativePlugin:DoricModalPlugin.class withName:@"modal"];
    [self registerNativePlugin:DoricShaderPlugin.class withName:@"shader"];

    [self registerViewNode:DoricStackNode.class withName:@"Stack"];
    [self registerViewNode:DoricVLayoutNode.class withName:@"VLayout"];
    [self registerViewNode:DoricHLayoutNode.class withName:@"HLayout"];
    [self registerViewNode:DoricTextNode.class withName:@"Text"];
    [self registerViewNode:DoricImageNode.class withName:@"Image"];
}

- (void)registerJSBundle:(NSString *)bundle withName:(NSString *)name {
    [self.bundles setObject:bundle forKey:name];
}

- (NSString *)acquireJSBundle:(NSString *)name {
    return [self.bundles objectForKey:name];
}

- (void)registerNativePlugin:(Class)pluginClass withName:(NSString *)name {
    [self.plugins setObject:pluginClass forKey:name];
}

- (Class)acquireNativePlugin:(NSString *)name {
    return [self.plugins objectForKey:name];
}

- (void)registerViewNode:(Class)nodeClass withName:(NSString *)name {
    [self.nodes setObject:nodeClass forKey:name];
}

- (Class)acquireViewNode:(NSString *)name {
    return [self.nodes objectForKey:name];
}

@end
