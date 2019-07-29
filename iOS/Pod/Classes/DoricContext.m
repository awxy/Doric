//
//  DoricContext.m
//  Doric
//
//  Created by pengfei.zhou on 2019/7/25.
//

#import "DoricContext.h"
#import "DoricContextManager.h"

@implementation DoricContext

- (instancetype)init {
    if(self = [super init]){
        _driver = [DoricDriver instance];
    }
    return self;
}
    
- (instancetype)initWithScript:(NSString *)script source:(NSString *)source {
    return [[DoricContextManager instance] createContext:script source:source];
}

- (void)dealloc {
    [[DoricContextManager instance] destroyContext:self];
}

- (DoricAsyncResult *)callEntity:(NSString *)method, ... {
    va_list args;
    va_start(args, method);
    DoricAsyncResult *ret = [self.driver invokeContextEntity:self.contextId method:method arguments:args];
    va_end(args);
    return ret;
}

@end
