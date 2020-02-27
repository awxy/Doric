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
//  DoricJSLoaderManager.m
//  Doric
//
//  Created by pengfei.zhou on 2019/11/23.
//

#import "DoricJSLoaderManager.h"
#import "DoricMainBundleJSLoader.h"
#import "DoricHttpJSLoader.h"
#import "Doric.h"

@interface DoricJSLoaderManager ()
@property(nonatomic, copy) NSSet <id <DoricLoaderProtocol>> *loaders;
@end

@implementation DoricJSLoaderManager
+ (instancetype)instance {
    static DoricJSLoaderManager *_instance;
    static dispatch_once_t onceToken;
    dispatch_once(&onceToken, ^{
        _instance = [DoricJSLoaderManager new];
    });
    return _instance;
}

- (instancetype)init {
    if (self = [super init]) {
        _loaders = [[NSSet alloc] initWithArray:@[
                [DoricMainBundleJSLoader new],
                [DoricHttpJSLoader new],
        ]];
    }
    return self;
}

- (void)addJSLoader:(id <DoricLoaderProtocol>)loader {
    self.loaders = [[self.loaders mutableCopy] also:^(NSMutableSet *it) {
        [it addObject:loader];
    }];
}

- (DoricAsyncResult <NSString *> *)request:(NSString *)source {
    __block DoricAsyncResult *ret;
    [self.loaders enumerateObjectsUsingBlock:^(id <DoricLoaderProtocol> obj, BOOL *stop) {
        if ([obj filter:source]) {
            ret = [obj request:source];
            *stop = YES;
        }
    }];
    if (!ret) {
        ret = [DoricAsyncResult new];
        [ret setupError:[NSException exceptionWithName:@"LoadingError"
                                                reason:[NSString stringWithFormat:@"Cannot find JS Loader for %@", source]
                                              userInfo:nil]];
    }
    return ret;
}
@end
